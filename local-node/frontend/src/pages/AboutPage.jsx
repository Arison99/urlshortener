export default function AboutPage() {
  const milestones = [
    "Founded by platform engineers focused on resilient redirect systems.",
    "Expanded to managed branded links for growth and product teams.",
    "Introduced analytics and governance capabilities for enterprise customers.",
    "Continuing to scale secure, observable link infrastructure globally."
  ];

  return (
    <section className="page-fade">
      <h2 className="text-3xl font-bold text-white">About LinkOps</h2>
      <p className="mt-3 max-w-3xl text-sm text-slate-300">
        LinkOps delivers reliable and secure URL operations services with a strong focus on platform engineering, observability, and measurable business outcomes.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-sky-200">Journey</h3>
        <ol className="mt-4 space-y-3">
          {milestones.map((item, index) => (
            <li key={item} className="flex gap-3 text-sm text-slate-300">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-300/50 bg-sky-500/15 text-xs text-sky-100">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
