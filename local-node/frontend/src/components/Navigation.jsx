const pages = ["Home", "Services", "Platform", "About", "Contact"];

export default function Navigation({ activePage, onChange }) {
  return (
    <header className="mb-8 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-sky-300">LinkOps</p>
          <h1 className="text-lg font-semibold text-white">Enterprise URL Intelligence Platform</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                activePage === page
                  ? "border-sky-300/60 bg-sky-400/15 text-sky-100"
                  : "border-slate-600 bg-slate-900/70 text-slate-300 hover:border-slate-500 hover:text-slate-100"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
