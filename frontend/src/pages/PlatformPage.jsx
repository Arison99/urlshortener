import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const fallbackMetrics = [
  ["Redirect Availability", "99.99%", "SLA-backed high availability across multi-zone runtime pools."],
  ["Avg Redirect Latency", "82ms", "Optimized pathing with private edge routing and smart cache strategy."],
  ["Secure Traffic Ratio", "100%", "All traffic channels protected with VPN and gateway policy controls."],
  ["VPN-Isolated Workloads", "24 regions", "Enterprise traffic isolated via L2TP, SSTP, IPSec, and WireGuard."],
  ["Monthly Redirect Events", "2.4B", "Scalable processing for high-volume campaign and product operations."],
  ["Threat Blocks", "31K/day", "Continuous filtering and policy enforcement at gateway and service layers."]
];

const fallbackSeries = {
  labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"],
  redirect_events: [150, 190, 170, 220, 240, 260, 250, 290, 320],
  new_links: [8, 11, 9, 13, 15, 18, 17, 20, 24]
};

const buildPolyline = (values, width = 620, height = 150, offsetX = 50, offsetY = 30) => {
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

export default function PlatformPage() {
  const pillars = [
    ["Reliability", "Global failover and resilient redirect architecture for mission-critical links."],
    ["Performance", "Sub-100ms redirect targets through optimized pathing and edge-aware routing."],
    ["Observability", "Distributed tracing, event telemetry, and service-level health visibility."],
    ["Automation", "Infrastructure-as-code and API tooling for scalable campaign operations."]
  ];

  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [series, setSeries] = useState(fallbackSeries);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [metricsResponse, analyticsResponse] = await Promise.all([
          axios.get("/api/public/metrics"),
          axios.get("/api/public/analytics")
        ]);

        if (!mounted) {
          return;
        }

        const apiKpis = metricsResponse?.data?.kpis ?? [];
        const kpiList = apiKpis.map((item) => [item.label, item.value, item.detail]);
        if (kpiList.length) {
          setMetrics(kpiList);
        }

        const apiSeries = analyticsResponse?.data?.series;
        if (apiSeries?.redirect_events?.length && apiSeries?.new_links?.length) {
          setSeries(apiSeries);
        }

        setLoadError("");
      } catch {
        if (mounted) {
          setLoadError("Public telemetry is temporarily unavailable. Showing fallback dashboard values.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    const interval = window.setInterval(loadDashboard, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const redirectLinePoints = useMemo(() => buildPolyline(series.redirect_events || fallbackSeries.redirect_events), [series]);
  const newLinksLinePoints = useMemo(() => buildPolyline(series.new_links || fallbackSeries.new_links), [series]);

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
      <h2 className="text-3xl font-bold text-white">Platform Engineering</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-300">
        The LinkOps platform is engineered for consistency, operational excellence, and secure service delivery across environments.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {pillars.map(([title, description]) => (
          <article key={title} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-emerald-200">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded bg-slate-700">
              <div className="h-full animate-pulse rounded bg-gradient-to-r from-sky-400 to-emerald-400" />
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-700/70 bg-slate-900/75 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">Enterprise Metrics Dashboard</h3>
          <span className="rounded-full border border-sky-400/35 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
            Live Telemetry Stream
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          Real-time visibility across redirect traffic, campaign performance, security posture, and network health.
        </p>
        {loading && <p className="mt-2 text-xs text-slate-400">Refreshing dashboard metrics...</p>}
        {loadError && <p className="mt-2 text-xs text-amber-200">{loadError}</p>}

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {metrics.map(([label, value, detail]) => (
            <article key={label} className="rounded-xl border border-slate-700 bg-slate-950/75 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1 text-2xl font-bold text-sky-200">{value}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{detail}</p>
              <div className="graph-bar mt-3" />
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950/75 p-4">
          <p className="mb-3 text-sm font-medium text-slate-200">Vector performance graph</p>
          <svg viewBox="0 0 720 220" className="w-full">
            <defs>
              <linearGradient id="metricLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <g>
              <line x1="40" y1="180" x2="680" y2="180" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="30" x2="40" y2="180" stroke="#334155" strokeWidth="1" />
            </g>
            <polyline points={redirectLinePoints} className="metric-graph-line" />
            <polyline points={newLinksLinePoints} className="metric-graph-line-alt" />
            <circle r="6" className="metric-graph-node">
              <animateMotion dur="7s" repeatCount="indefinite" path={redirectMotionPath} />
            </circle>
            <circle r="5" className="metric-graph-node-alt">
              <animateMotion dur="8s" repeatCount="indefinite" path={newLinksMotionPath} />
            </circle>
          </svg>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-emerald-100">Security Architecture</h3>
          <p className="mt-2 text-sm text-emerald-50">
            LinkOps workloads are designed to operate in VPN-isolated segments with strict nginx gateway controls and segmented network policy.
          </p>
        </article>
        <article className="rounded-xl border border-sky-400/25 bg-sky-500/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-sky-100">Network Stack Options</h3>
          <p className="mt-2 text-sm text-sky-50">
            Protocol support includes L2TP, SSTP, IPSec, and WireGuard along with SDN controls and cloud management integrations.
          </p>
        </article>
      </section>
    </section>
  );
}
