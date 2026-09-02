from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    db_host: str = "localhost"
    db_user: str = "taskmanager"
    db_password: str = "taskmanager"
    db_name: str = "taskmanager"
    app_name: str = "TaskFlow Analytics"

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:5432/{self.db_name}?sslmode=require"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()