export default function ServicesPage() {
  const services = [
    {
      title: "Managed URL Shortening",
      detail: "Production-ready short links with low-latency redirect infrastructure and high availability."
    },
    {
      title: "Campaign Link Governance",
      detail: "Role-based controls, lifecycle policies, and naming standards for marketing and product teams."
    },
    {
      title: "Analytics & Reporting",
      detail: "Channel, geography, and campaign attribution with downloadable reporting for stakeholders."
    },
    {
      title: "Security & Compliance",
      detail: "Transport security, audit trails, and policy-aligned redirect controls for enterprise use."
    },
    {
      title: "Enterprise VPN Services",
      detail: "Private connectivity options including L2TP, SSTP, IPSec, and WireGuard to isolate link traffic."
    },
    {
      title: "Cloud Management",
      detail: "Cloud posture management, workload governance, and deployment automation across hybrid environments."
    },
    {
      title: "Software Defined Networking",
      detail: "SDN-ready traffic steering and segmentation for predictable performance and secure service routing."
    }
  ];

  return (
    <section className="page-fade">
      <h2 className="text-3xl font-bold text-white">Services</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-300">
        LinkOps offers end-to-end URL operations and secure network services for growth teams, enterprise platform teams, and regulated workloads.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-sky-200">{service.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{service.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-emerald-100">Free Enterprise Demo</h3>
          <p className="mt-2 text-sm text-emerald-50">
            Get a guided demo with live link creation, dashboard metrics, and a secure architecture walkthrough.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-emerald-100/90">
            <li>• 30-minute technical and business session</li>
            <li>• Pilot setup recommendations</li>
            <li>• Migration and onboarding plan</li>
          </ul>
        </article>

        <article className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-sky-100">Security Bragging Rights</h3>
          <p className="mt-2 text-sm text-sky-50">
            Our services run inside private VPN overlays with nginx gateway hardening so your redirect and analytics data stays protected in transit.
          </p>
          <p className="mt-3 text-sm text-sky-100/90">Supported enterprise tunnels: L2TP, SSTP, IPSec, WireGuard.</p>
        </article>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-950/70 p-3">
        <svg viewBox="0 0 640 180" className="w-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path d="M30 90 L220 90 L310 40 L420 140 L610 140" className="vector-line" />
          <path d="M30 120 L230 120 L330 70 L430 70 L610 40" className="vector-line-alt" />
          <circle r="6" className="vector-dot">
            <animateMotion dur="4s" repeatCount="indefinite" path="M30 90 L220 90 L310 40 L420 140 L610 140" />
          </circle>
          <circle r="5" className="vector-dot-alt">
            <animateMotion dur="5.5s" repeatCount="indefinite" path="M30 120 L230 120 L330 70 L430 70 L610 40" />
          </circle>
          <circle r="4" className="vector-dot-3">
            <animateMotion dur="6.2s" repeatCount="indefinite" path="M610 40 L430 70 L330 70 L230 120 L30 120" />
          </circle>
          <text x="20" y="30" fill="#e2e8f0" fontSize="12">Client</text>
          <text x="245" y="28" fill="#e2e8f0" fontSize="12">Gateway</text>
          <text x="392" y="28" fill="#e2e8f0" fontSize="12">LinkOps API</text>
          <text x="560" y="28" fill="#e2e8f0" fontSize="12">Data Lake</text>
        </svg>
      </div>
    </section>
  );
}
