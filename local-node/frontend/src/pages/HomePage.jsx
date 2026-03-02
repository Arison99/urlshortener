export default function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center page-fade">
      <div>
        <p className="float-2d inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
          Enterprise Link Platform · VPN + Nginx Security
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Enterprise URL shortening for secure campaigns, global teams, and mission-critical traffic.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
          LinkOps powers branded links with private network architecture, running inside VPN overlays and nginx gateway controls to protect your business data end-to-end.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Branded domains and custom aliases",
            "Real-time metrics dashboards and exports",
            "Secure redirect edge architecture",
            "Enterprise VPN and SDN integration"
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3 text-sm text-slate-200 backdrop-blur-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Free demo available for enterprise teams: security architecture walkthrough, live dashboard review, and pilot link rollout.
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="scene-3d scene-3d-lg">
          <div className="cube-3d">
            <div className="cube-face cube-front">LINK</div>
            <div className="cube-face cube-back">SCALE</div>
            <div className="cube-face cube-right">TRACK</div>
            <div className="cube-face cube-left">SECURE</div>
            <div className="cube-face cube-top">FAST</div>
            <div className="cube-face cube-bottom">RELIABLE</div>
          </div>
          <div className="orbit-ring orbit-ring-a" />
          <div className="orbit-ring orbit-ring-b" />
          <div className="orbit-ring orbit-ring-c" />
        </div>
      </div>
    </section>
  );
}
