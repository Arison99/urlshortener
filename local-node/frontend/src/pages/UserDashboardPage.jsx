import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const buildPolyline = (values, width = 620, height = 150, offsetX = 50, offsetY = 30) => {
  if (!values?.length) {
    return "50,180 670,180";
  }

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = Math.max(maxValue - minValue, 1);

  return values
    .map((value, index) => {
      const stepX = values.length > 1 ? (width / (values.length - 1)) * index : 0;
      const normalized = (value - minValue) / range;
      const y = offsetY + (1 - normalized) * height;
      return `${Math.round(offsetX + stepX)},${Math.round(y)}`;
    })
    .join(" ");
};

const numberFormat = (value) => new Intl.NumberFormat("en-US").format(value || 0);

export default function UserDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/public/url-dashboard");
        if (!mounted) {
          return;
        }
        setData(response.data);
        setError("");
      } catch {
        if (mounted) {
          setError("Unable to load dashboard data right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    const interval = window.setInterval(load, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const kpis = data?.kpis || {
    total_links: 0,
    links_last_24h: 0,
    links_last_7d: 0,
    unique_domains: 0,
    total_clicks: 0,
    clicks_last_24h: 0,
    total_searches: 0,
    searches_last_24h: 0,
    click_through_rate: 0
  };

  const series = data?.series || { labels: [], redirect_events: [], new_links: [], search_events: [] };

  const redirectLinePoints = useMemo(
    () => buildPolyline(series.redirect_events || []),
    [series]
  );
  const newLinksLinePoints = useMemo(
    () => buildPolyline(series.new_links || []),
    [series]
  );

  const redirectMotionPath = useMemo(
    () => `M ${redirectLinePoints.split(" ").join(" L ")}`,
    [redirectLinePoints]
  );
  const newLinksMotionPath = useMemo(
    () => `M ${newLinksLinePoints.split(" ").join(" L ")}`,
    [newLinksLinePoints]
  );

  return (
    <section className="page-fade">
      <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">User URL Analytics Dashboard</h2>
            <p className="mt-1 text-sm text-emerald-50">Professional enterprise analytics — currently free while LinkOps is in early launch.</p>
          </div>
          <span className="rounded-full border border-emerald-300/60 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Free Dashboard
          </span>
        </div>
      </div>

      {loading && <p className="mb-4 text-sm text-slate-300">Loading dashboard metrics...</p>}
      {error && <p className="mb-4 text-sm text-red-200">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total URLs</p>
          <p className="mt-1 text-2xl font-bold text-sky-200">{numberFormat(kpis.total_links)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Last 24 Hours</p>
          <p className="mt-1 text-2xl font-bold text-emerald-200">{numberFormat(kpis.links_last_24h)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Last 7 Days</p>
          <p className="mt-1 text-2xl font-bold text-violet-200">{numberFormat(kpis.links_last_7d)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Unique Domains</p>
          <p className="mt-1 text-2xl font-bold text-cyan-200">{numberFormat(kpis.unique_domains)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Clicks</p>
          <p className="mt-1 text-2xl font-bold text-fuchsia-200">{numberFormat(kpis.total_clicks)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Clicks (24h)</p>
          <p className="mt-1 text-2xl font-bold text-amber-200">{numberFormat(kpis.clicks_last_24h)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Searches</p>
          <p className="mt-1 text-2xl font-bold text-rose-200">{numberFormat(kpis.total_searches)}</p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Searches (24h)</p>
          <p className="mt-1 text-2xl font-bold text-lime-200">{numberFormat(kpis.searches_last_24h)}</p>
        </article>
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Click-through Ratio</p>
        <p className="mt-1 text-2xl font-bold text-sky-100">{kpis.click_through_rate} clicks / URL</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-700 bg-slate-900/75 p-4 lg:col-span-2">
          <h3 className="text-base font-semibold text-white">URL Activity Trends</h3>
          <p className="mt-1 text-xs text-slate-300">Auto-refresh every 30 seconds from public dashboard telemetry.</p>
          <svg viewBox="0 0 720 220" className="mt-3 w-full">
            <defs>
              <linearGradient id="dashboardMetricLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <line x1="40" y1="180" x2="680" y2="180" stroke="#334155" strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="180" stroke="#334155" strokeWidth="1" />
            <polyline points={redirectLinePoints} className="metric-graph-line dashboard-line-primary" />
            <polyline points={newLinksLinePoints} className="metric-graph-line-alt dashboard-line-secondary" />
            <circle r="5" className="metric-graph-node">
              <animateMotion dur="7s" repeatCount="indefinite" path={redirectMotionPath} />
            </circle>
            <circle r="4" className="metric-graph-node-alt">
              <animateMotion dur="8.5s" repeatCount="indefinite" path={newLinksMotionPath} />
            </circle>
          </svg>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900/75 p-4">
          <h3 className="text-base font-semibold text-white">Top Domains</h3>
          <div className="mt-3 space-y-2">
            {(data?.top_domains || []).slice(0, 5).map((item) => (
              <div key={item.domain} className="rounded-lg border border-slate-700 bg-slate-950/70 p-2 text-sm">
                <p className="truncate text-slate-200">{item.domain}</p>
                <p className="text-xs text-slate-400">{numberFormat(item.count)} links</p>
              </div>
            ))}
            {(!data?.top_domains || data.top_domains.length === 0) && (
              <p className="text-sm text-slate-400">No domain analytics yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-700 bg-slate-900/75 p-4">
        <h3 className="text-base font-semibold text-white">Recent URLs</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300">
                <th className="px-2 py-2">Short Code</th>
                <th className="px-2 py-2">Original URL</th>
                <th className="px-2 py-2">Clicks</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_links || []).map((row) => (
                <tr key={`${row.short_code}-${row.created_at}`} className="border-b border-slate-800/70 text-slate-200">
                  <td className="px-2 py-2 font-mono">{row.short_code}</td>
                  <td className="max-w-md truncate px-2 py-2">{row.original_url}</td>
                  <td className="px-2 py-2 text-slate-300">{numberFormat(row.clicks)}</td>
                  <td className="px-2 py-2 text-xs text-slate-400">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!data?.recent_links || data.recent_links.length === 0) && (
            <p className="mt-2 text-sm text-slate-400">No shortened URLs yet. Create one to see analytics.</p>
          )}
        </div>
      </section>
    </section>
  );
}
