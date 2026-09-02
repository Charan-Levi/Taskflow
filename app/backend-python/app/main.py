from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.routes import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="TaskFlow Analytics API",
    description="Python FastAPI backend for analytics and insights",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics_router, prefix="/api/python")

@app.get("/api/python/health")
async def health_v1():
    return {"status": "UP", "service": "Python FastAPI"}

@app.get("/health")
async def health():
    return {"status": "UP", "service": "Python FastAPI"}
