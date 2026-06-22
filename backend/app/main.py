from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import questions

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Question Generator API",
    description="Generates tailored technical interview questions using Groq's LLM API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "AI Interview Question Generator API is running."}


@app.get("/health")
def health_check():
    return {"status": "healthy"}