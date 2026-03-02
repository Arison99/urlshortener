export default function ShortenerCard({
  url,
  shortUrl,
  error,
  loading,
  copied,
  setUrl,
  onKeyDown,
  onSubmit,
  onCopy
}) {
  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/75 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Create a short URL</h2>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          API Connected
        </span>
      </div>

      <label htmlFor="url-input" className="mb-2 block text-sm font-medium text-slate-200">
        Destination URL
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          id="url-input"
          className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
          placeholder="example.com/campaign"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          className="rounded-lg bg-sky-500 px-5 py-2 font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-400/30 bg-red-500/20 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/70 p-4">
          <div className="mb-3 h-3 w-32 animate-pulse rounded bg-slate-700" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-700" />
        </div>
      )}

      {!loading && shortUrl && (
        <div className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="mb-2 text-sm font-medium text-emerald-200">Short URL ready</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-emerald-100 underline">
              {shortUrl}
            </a>
            <button
              className="rounded-md border border-emerald-300/50 bg-slate-900/60 px-3 py-1.5 text-sm font-medium text-emerald-100 hover:bg-slate-900"
              onClick={onCopy}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
