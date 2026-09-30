"""Configuration settings for IP-SAKTI Sahayak Backend."""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "IP-SAKTI Sahayak"
    PROJECT_DESCRIPTION: str = "Evidence-grounded, jurisdiction-aware intelligence copilot for Ayurveda innovation."
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # API & CORS
    API_PREFIX: str = "/api"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ipsakti_dev"
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # LLM Provider Configuration
    LLM_PROVIDER: str = "mock_for_dev"
    LLM_API_KEY: str = ""
    LLM_MODEL_NAME: str = "deepseek-chat"
    LLM_TEMPERATURE: float = 0.0
    
    # Retrieval & Embeddings
    EMBEDDING_PROVIDER: str = "bge_m3"
    EMBEDDING_MODEL: str = "BAAI/bge-m3"
    EMBEDDING_DIMENSION: int = 1024
    RERANKER_MODEL: str = "BAAI/bge-reranker-large"
    HYBRID_SEARCH_ALPHA: float = 0.6

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
