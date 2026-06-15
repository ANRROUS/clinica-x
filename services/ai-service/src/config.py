from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 3005
    JWT_SECRET: str = "change_this_secret"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_MODEL_PRO: str = "gemini-1.5-pro"
    AI_TIMEOUT_MS: int = 30000

    CLINICAL_SERVICE_URL: str = "http://localhost:3002"
    AUTH_SERVICE_URL: str = "http://localhost:3000"
    APPOINTMENT_SERVICE_URL: str = "http://localhost:3001"
    INTERNAL_API_KEY: str = "internal-dev-key-change-in-prod"

    # For chat_messages persistence (connects to chat_service schema)
    DATABASE_URL: str = ""
    DIRECT_URL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
