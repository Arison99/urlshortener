# Hybrid URL Shortener

Professional URL shortener platform (bare-metal) with:

- FastAPI backend + SQLite persistence
- React/Vite frontend with enterprise pages + free user analytics dashboard
- Public metrics/analytics APIs for KPI dashboards
- Optional secure access path through WireGuard + nginx gateway

## Tech Stack

- Backend: FastAPI, SQLAlchemy, SQLite
- Frontend: React 18, Vite 5, TailwindCSS
- Networking: nginx configs (in `ec2-gateway/`)

## Repository Structure

- `ec2-gateway/`
   - `nginx/nginx.conf`
- `local-node/`
   - `backend/` (FastAPI API + data models)
   - `frontend/` (website + dashboard UI)

## Local Development (Bare Metal)

### 1) Start Backend (FastAPI)

From the repository root:

```powershell
cd local-node/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DATABASE_URL="sqlite:///./urlshortener.db"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend health check:

- `http://localhost:8000/healthz`

### 2) Start Frontend (Vite)

Open a new terminal:

```powershell
cd local-node/frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Frontend URL:

- `http://localhost:3000`

### 3) Build Frontend (Production Check)

```powershell
cd local-node/frontend
npm run build
```

## Environment Variables

### Backend

- `DATABASE_URL` (optional)
   - Default in code: `sqlite:///./urlshortener.db`
   - Example override: `sqlite:///./urlshortener.db`

### Frontend (Vite)

- `vite.config.js` currently allows `app.samwifi.site` in `server.allowedHosts`
- API traffic proxies to backend at `http://backend:8000` for `/api/*` during dev

If you run backend locally (not in a host named `backend`), set the proxy target in `local-node/frontend/vite.config.js` to `http://127.0.0.1:8000`.

## API Reference

### Core URL APIs

- `POST /api/shorten`
   - Body: `{ "url": "https://example.com" }`
   - Response: `{ "short_code": "abc123", "url": "https://example.com" }`

- `GET /{code}`
   - Redirects to the original URL
   - Also records click analytics

- `GET /api/search?query=...`
   - Returns URL records matching `short_code` or original URL
   - Records search analytics event

### Public Metrics APIs

- `GET /api/public/metrics`
   - KPI cards + security metadata + summary counters

- `GET /api/public/analytics`
   - Time-series telemetry (`new_links`, `redirect_events`, `search_events`)

- `GET /api/public/url-dashboard`
   - Free user dashboard payload:
      - KPI totals (links, clicks, searches)
      - top domains
      - recent links (with click counts)
      - trend series

## Troubleshooting

### `python app.py` fails

This project does not use an `app.py` entrypoint. Start backend with:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### `flask run` fails

Backend is FastAPI, not Flask. Use `uvicorn` command above.

### Vite host blocked error

If you see “host is not allowed”, add your domain to `server.allowedHosts` in:

- `local-node/frontend/vite.config.js`

### Short links not redirecting in dev

Ensure Vite proxy includes short-code route forwarding and backend is reachable.

## Security Notes

- Expose services only on trusted interfaces.
- For remote access, route through WireGuard and optionally front with nginx.
- Keep WireGuard keys private and rotate them regularly.
