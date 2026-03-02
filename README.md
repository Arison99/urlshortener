# Hybrid URL Shortener

Bare-metal starter kit for a hybrid URL shortener with:

- EC2 gateway (`nginx` + WireGuard)
- Local node workloads (FastAPI backend, React frontend, SQLite)
- secure ingress via WireGuard + nginx gateway routing

## Project Structure

- `ec2-gateway/`
  - `nginx/nginx.conf`
  - `wireguard/wg0.conf`
- `local-node/`
  - `backend/` (FastAPI + SQLAlchemy)
  - `frontend/` (React + Tailwind + Vite)
  - `data/` (SQLite DB storage)

## Bare Metal Quick Start

1. Start backend:
   - `cd ../backend`
   - `python -m venv .venv`
   - `.\.venv\Scripts\Activate.ps1`
   - `pip install -r requirements.txt`
   - `$env:DATABASE_URL="sqlite:///./urlshortener.db"`
   - `uvicorn app.main:app --host 0.0.0.0 --port 8000`
2. Start frontend (new terminal):
   - `cd local-node/frontend`
   - `npm install`
   - `npm run dev -- --host 0.0.0.0 --port 3000`
3. SQLite database file:
   - auto-created at `local-node/backend/urlshortener.db`
4. Open app:
   - `http://localhost:3000`
5. API health:
   - `http://localhost:8000/healthz`

## WireGuard Notes

Populate placeholders in:

- `ec2-gateway/wireguard/wg0.conf`
- `local-node/wireguard/wg0.conf`

Then bring interfaces up on both ends with your host-specific WireGuard workflow.

## Security Notes

- Run backend/frontend only on interfaces you trust and route through WireGuard where possible.
