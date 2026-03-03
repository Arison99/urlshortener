export default function ContactPage() {
  return (
    <section className="page-fade">
      <h2 className="text-3xl font-bold text-white">Contact & Engagement</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-300">
        Partner with LinkOps to modernize your URL strategy with secure network architecture, nginx gateway protection, and measurable growth outcomes.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-emerald-200">Get in touch</h3>
          <p className="mt-2 text-sm text-slate-300">Email: enterprise@linkops.samwifi.site</p>
          <p className="mt-1 text-sm text-slate-300">Sales: +256 (076) 770-8272</p>
          <p className="mt-1 text-sm text-slate-300">Support SLA: 24/7 global support</p>
        </div>

        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-sky-200">Engagement model</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            <li>• Discovery and architecture workshop</li>
            <li>• Pilot rollout for priority campaigns</li>
            <li>• Full production onboarding and governance</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-emerald-100">Book your free enterprise demo</h3>
            <p className="mt-1 text-sm text-emerald-50">
              See live metrics dashboards, VPN-secured data flow, and hardened nginx gateway controls in action.
            </p>
          </div>
          <button className="rounded-lg border border-emerald-200/60 bg-slate-950/60 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-slate-950">
            Request Free Demo
          </button>
        </div>
      </div>
    </section>
  );
}
