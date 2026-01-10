import os
from .decorators import Decorators


@Decorators.singleton
class Config:
    """Application configuration as a Singleton accessible via Config.get_instance()."""

    instance = None

    def __init__(self) -> None:
        # backend
        self.connection_string = os.getenv("DB_CONNECTION_STRING")
        self.port = int(os.getenv("PORT", 8000))
        self.ELEMENTS_PER_PAGE = 10

        # frontend

        # devops
