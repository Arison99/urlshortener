from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base


class UrlMapping(Base):
    __tablename__ = "url_mappings"

    id = Column(Integer, primary_key=True, index=True)
    short_code = Column(String(32), unique=True, index=True, nullable=False)
    original_url = Column(String(2048), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class UrlEvent(Base):
    __tablename__ = "url_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(32), index=True, nullable=False)
    short_code = Column(String(32), index=True, nullable=True)
    query_text = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
