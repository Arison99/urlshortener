from fastapi import FastAPI
from .routes import router
from .database import engine
from .models import Base

app = FastAPI(title="Hybrid URL Shortener")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/healthz")
def healthcheck():
    return {"status": "ok"}


app.include_router(router)
