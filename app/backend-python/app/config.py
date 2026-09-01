from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql://taskmanager:taskmanager@localhost:5432/taskmanager"
    app_name: str = "TaskFlow Analytics"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()