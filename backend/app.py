from flask import Flask

from .config import Config

def create_app() -> Flask:
    cfg = Config.get_instance()

    app = Flask(__name__)

    return app

app = create_app()

if __name__ == "__main__":
    cfg = Config.get_instance()
    app.run(debug=True)