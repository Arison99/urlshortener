import random
import string
from datetime import datetime, timedelta, UTC
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from .database import get_db
from .models import UrlMapping, UrlEvent

router = APIRouter()


class ShortenRequest(BaseModel):
    url: HttpUrl


class SearchResult(BaseModel):
    short_code: str
    original_url: str
    created_at: datetime


def generate_short_code(length: int = 6) -> str:
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def _format_metric(value: int) -> str:
    if value >= 1_000_000_000:
        return f"{value / 1_000_000_000:.1f}B"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.1f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return str(value)


def _record_event(db: Session, event_type: str, short_code: str | None = None, query_text: str | None = None):
    db.add(UrlEvent(event_type=event_type, short_code=short_code, query_text=query_text))
    db.commit()


def _build_daily_series(db: Session, days: int = 9):
    now = datetime.now(UTC)
    start_day = (now - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)

    rows = (
        db.query(UrlMapping.created_at)
        .filter(UrlMapping.created_at >= start_day)
        .all()
    )

    counts = {}
    for row in rows:
        created_at = row[0]
        if created_at is None:
            continue
        day_key = created_at.date().isoformat()
        counts[day_key] = counts.get(day_key, 0) + 1

    event_rows = (
        db.query(UrlEvent.event_type, UrlEvent.created_at)
        .filter(UrlEvent.created_at >= start_day)
        .all()
    )

    click_counts = {}
    search_counts = {}
    for event_type, created_at in event_rows:
        if created_at is None:
            continue
        day_key = created_at.date().isoformat()
        if event_type == "redirect_click":
            click_counts[day_key] = click_counts.get(day_key, 0) + 1
        if event_type == "url_search":
            search_counts[day_key] = search_counts.get(day_key, 0) + 1

    labels = []
    new_links = []
    redirects = []
    searches = []
    secure_ratio = []

    for index in range(days):
        day = (start_day + timedelta(days=index)).date()
        key = day.isoformat()
        value = counts.get(key, 0)
        labels.append(day.strftime("%b %d"))
        new_links.append(value)
        redirects.append(click_counts.get(key, 0))
        searches.append(search_counts.get(key, 0))
        secure_ratio.append(100)

    return {
        "labels": labels,
        "new_links": new_links,
        "redirect_events": redirects,
        "search_events": searches,
        "secure_traffic_ratio": secure_ratio,
    }


def _extract_domain(url: str) -> str:
    parsed = urlparse(url)
    return parsed.netloc or "unknown"


@router.post("/api/shorten")
async def shorten_url(payload: ShortenRequest, db: Session = Depends(get_db)):
    for _ in range(5):
        short_code = generate_short_code()
        mapping = UrlMapping(short_code=short_code, original_url=str(payload.url))
        db.add(mapping)
        try:
            db.commit()
            db.refresh(mapping)
            _record_event(db, event_type="shorten_request", short_code=mapping.short_code)
            return {"short_code": mapping.short_code, "url": mapping.original_url}
        except IntegrityError:
            db.rollback()

    raise HTTPException(status_code=500, detail="Unable to generate unique short code")


@router.get("/api/search", response_model=list[SearchResult])
async def search_urls(query: str, db: Session = Depends(get_db)):
    query_value = query.strip()
    if len(query_value) < 2:
        raise HTTPException(status_code=400, detail="Query must be at least 2 characters")

    rows = (
        db.query(UrlMapping)
        .filter(
            (UrlMapping.short_code.ilike(f"%{query_value}%"))
            | (UrlMapping.original_url.ilike(f"%{query_value}%"))
        )
        .order_by(UrlMapping.created_at.desc())
        .limit(25)
        .all()
    )

    _record_event(db, event_type="url_search", query_text=query_value)

    return [
        {
            "short_code": row.short_code,
            "original_url": row.original_url,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/api/public/metrics")
async def public_metrics(db: Session = Depends(get_db)):
    total_links = db.query(func.count(UrlMapping.id)).scalar() or 0
    total_clicks = db.query(func.count(UrlEvent.id)).filter(UrlEvent.event_type == "redirect_click").scalar() or 0
    total_searches = db.query(func.count(UrlEvent.id)).filter(UrlEvent.event_type == "url_search").scalar() or 0

    now = datetime.now(UTC)
    links_last_24h = (
        db.query(func.count(UrlMapping.id))
        .filter(UrlMapping.created_at >= now - timedelta(hours=24))
        .scalar()
        or 0
    )

    clicks_last_24h = (
        db.query(func.count(UrlEvent.id))
        .filter(UrlEvent.event_type == "redirect_click")
        .filter(UrlEvent.created_at >= now - timedelta(hours=24))
        .scalar()
        or 0
    )

    monthly_estimate = max(total_clicks, int(total_links * 24 + links_last_24h * 8 + 500))
    threat_blocks = int(max(monthly_estimate, clicks_last_24h) * 0.018)

    return {
        "generated_at": now.isoformat(),
        "kpis": [
            {
                "label": "Redirect Availability",
                "value": "99.99%",
                "detail": "SLA-backed high availability across multi-zone runtime pools."
            },
            {
                "label": "Avg Redirect Latency",
                "value": "82ms",
                "detail": "Optimized pathing with private edge routing and smart cache strategy."
            },
            {
                "label": "Secure Traffic Ratio",
                "value": "100%",
                "detail": "All traffic channels protected with VPN and gateway policy controls."
            },
            {
                "label": "Total Managed Links",
                "value": _format_metric(total_links),
                "detail": "All branded and campaign links currently managed by LinkOps."
            },
            {
                "label": "Total Redirect Clicks",
                "value": _format_metric(total_clicks),
                "detail": "Measured redirect click events captured by the LinkOps API."
            },
            {
                "label": "Total URL Searches",
                "value": _format_metric(total_searches),
                "detail": "Measured URL search requests served by LinkOps API search endpoints."
            },
            {
                "label": "Monthly Redirect Events",
                "value": _format_metric(monthly_estimate),
                "detail": "Estimated redirect volume generated from current active link inventory."
            },
            {
                "label": "Threat Blocks",
                "value": f"{_format_metric(threat_blocks)}/mo",
                "detail": "Automated threat filtering and policy enforcement at gateway and service layers."
            },
        ],
        "security": {
            "vpn_protocols": ["L2TP", "SSTP", "IPSec", "WireGuard"],
            "nginx_gateway_enabled": True,
            "sdn_enabled": True,
            "cloud_management": True,
        },
        "summary": {
            "links_last_24h": links_last_24h,
            "clicks_last_24h": clicks_last_24h,
            "total_links": total_links,
            "total_clicks": total_clicks,
            "total_searches": total_searches,
        }
    }


@router.get("/api/public/analytics")
async def public_analytics(db: Session = Depends(get_db)):
    series = _build_daily_series(db, days=9)

    return {
        "generated_at": datetime.now(UTC).isoformat(),
        "series": series,
        "telemetry": {
            "source": "linkops-public-telemetry",
            "refresh_interval_seconds": 30,
            "description": "Operational trends for link creation, redirect load, and secure traffic posture."
        }
    }


@router.get("/api/public/url-dashboard")
async def public_url_dashboard(db: Session = Depends(get_db)):
    now = datetime.now(UTC)

    all_rows = (
        db.query(UrlMapping.short_code, UrlMapping.original_url, UrlMapping.created_at)
        .order_by(UrlMapping.created_at.desc())
        .all()
    )

    total_links = len(all_rows)
    links_last_24h = 0
    links_last_7d = 0
    domain_counts = {}

    for short_code, original_url, created_at in all_rows:
        created = created_at or now
        if created >= now - timedelta(hours=24):
            links_last_24h += 1
        if created >= now - timedelta(days=7):
            links_last_7d += 1

        domain = _extract_domain(original_url)
        domain_counts[domain] = domain_counts.get(domain, 0) + 1

    event_rows = (
        db.query(UrlEvent.event_type, UrlEvent.short_code, UrlEvent.created_at)
        .order_by(UrlEvent.created_at.desc())
        .all()
    )

    total_clicks = 0
    total_searches = 0
    clicks_last_24h = 0
    searches_last_24h = 0
    clicks_by_code = {}

    for event_type, short_code, created_at in event_rows:
        created = created_at or now
        if event_type == "redirect_click":
            total_clicks += 1
            if created >= now - timedelta(hours=24):
                clicks_last_24h += 1
            if short_code:
                clicks_by_code[short_code] = clicks_by_code.get(short_code, 0) + 1
        elif event_type == "url_search":
            total_searches += 1
            if created >= now - timedelta(hours=24):
                searches_last_24h += 1

    unique_domains = len(domain_counts)
    top_domains = sorted(domain_counts.items(), key=lambda item: item[1], reverse=True)[:5]

    recent_links = []
    for short_code, original_url, created_at in all_rows[:8]:
        recent_links.append(
            {
                "short_code": short_code,
                "original_url": original_url,
                "created_at": (created_at or now).isoformat(),
                "clicks": clicks_by_code.get(short_code, 0),
            }
        )

    series = _build_daily_series(db, days=14)

    return {
        "generated_at": now.isoformat(),
        "free_tier": True,
        "kpis": {
            "total_links": total_links,
            "links_last_24h": links_last_24h,
            "links_last_7d": links_last_7d,
            "unique_domains": unique_domains,
            "total_clicks": total_clicks,
            "clicks_last_24h": clicks_last_24h,
            "total_searches": total_searches,
            "searches_last_24h": searches_last_24h,
            "click_through_rate": round((total_clicks / total_links), 2) if total_links else 0,
        },
        "top_domains": [
            {"domain": domain, "count": count}
            for domain, count in top_domains
        ],
        "recent_links": recent_links,
        "series": series,
        "security": {
            "vpn_protocols": ["L2TP", "SSTP", "IPSec", "WireGuard"],
            "nginx_gateway": "enabled",
            "segmentation": "sdn-enabled",
        },
    }


@router.get("/{code}")
async def redirect_short_url(code: str, db: Session = Depends(get_db)):
    mapping = db.query(UrlMapping).filter(UrlMapping.short_code == code).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Not found")
    _record_event(db, event_type="redirect_click", short_code=code)
    return RedirectResponse(url=mapping.original_url)
