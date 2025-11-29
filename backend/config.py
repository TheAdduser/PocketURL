from .decorators import singleton


@singleton
class Config:
    """Application configuration as a Singleton accessible via Config.get_instance()."""

    instance = None

    def __init__(self) -> None:
        # backend
        self.urls_database_path = "./database/urls.db"
        self.metrics_database_path = "./database/metrics.db"

        # frontend

        # devops
