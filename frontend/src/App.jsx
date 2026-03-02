import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navigation from "./components/Navigation";
import ShortenerCard from "./components/ShortenerCard";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import PlatformPage from "./pages/PlatformPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import UserDashboardPage from "./pages/UserDashboardPage";

export default function App() {
  const matrixCanvasRef = useRef(null);
  const [activePage, setActivePage] = useState("Home");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const fontSize = 22;
    const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@*";
    let columns = 0;
    let drops = [];

    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    initialize();

    const drawFrame = () => {
      context.fillStyle = "rgba(2, 6, 23, 0.08)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(16, 185, 129, 0.4)";
      context.font = `${fontSize}px monospace`;

      for (let index = 0; index < drops.length; index += 1) {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        context.fillText(text, index * fontSize, drops[index] * fontSize);

        if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }
        drops[index] += 1;
      }
    };

    const intervalId = window.setInterval(drawFrame, 50);
    window.addEventListener("resize", initialize);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", initialize);
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((current) => ({ ...current, show: false }));
    }, 2200);
  };

  const normalizeUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!url) {
      setError("Please enter a URL.");
      showToast("Please enter a URL.", "error");
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(url);
      const res = await axios.post("/api/shorten", { url: normalizedUrl });
      setShortUrl(`${window.location.origin}/${res.data.short_code}`);
      showToast("Short URL created.", "success");
    } catch {
      setError("Unable to shorten this URL right now. Please verify the input and try again.");
      showToast("Failed to create short URL.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      showToast("Short URL copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
      showToast("Clipboard copy failed.", "error");
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "Services":
        return <ServicesPage />;
      case "Platform":
        return <PlatformPage />;
      case "About":
        return <AboutPage />;
      case "Contact":
        return <ContactPage />;
      case "Home":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <canvas ref={matrixCanvasRef} className="matrix-bg" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/75 to-slate-950" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:py-12">
        <Navigation activePage={activePage} onChange={setActivePage} />

        <div className="flex justify-end">
          <button
            className="rounded-lg border border-emerald-300/50 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25"
            onClick={() => setDashboardOpen((current) => !current)}
          >
            {dashboardOpen ? "Back to Website" : "Open Free User Dashboard"}
          </button>
        </div>

        {toast.show && (
          <div
            className={`rounded-lg border px-4 py-2 text-sm shadow-sm backdrop-blur ${
              toast.type === "error"
                ? "border-red-400/40 bg-red-500/20 text-red-100"
                : "border-emerald-400/40 bg-emerald-500/20 text-emerald-100"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        )}

        <div className="mx-auto w-full max-w-5xl">
          {dashboardOpen ? <UserDashboardPage /> : renderPage()}
        </div>

        {!dashboardOpen && (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <ShortenerCard
                url={url}
                shortUrl={shortUrl}
                error={error}
                loading={loading}
                copied={copied}
                setUrl={setUrl}
                onKeyDown={onKeyDown}
                onSubmit={handleSubmit}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}

        <footer className="pt-2 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Samwifi Networks. LinkOps URL Services · Secure short links for teams and enterprises.
        </footer>
      </div>
    </div>
  );
}
