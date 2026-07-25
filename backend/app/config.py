import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Resume Analyzer"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resume_analyzer.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-ai-resume-analyzer-development-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
