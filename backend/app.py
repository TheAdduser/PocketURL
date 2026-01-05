from flask import Flask, jsonify, request, redirect
import os
from dotenv import load_dotenv, dotenv_values
from sqlalchemy import create_engine
import sqlalchemy as db
from sqlalchemy.sql import func
from .link_service import shorten

load_dotenv()
config = dotenv_values(".env")

connection_string = config["DB_CONNECTION_STRING"]
print(connection_string)

# from .config import Config


def create_app() -> Flask:
    # cfg = Config.get_instance()

    app = Flask(__name__)

    metadata_obj = db.MetaData()

    links = db.Table(
        "Links",
        metadata_obj,
        db.Column("ShortUrl", db.String, primary_key=True),
        db.Column("LongUrl", db.String),
    )

    clicks = db.Table(
        "Clicks",
        metadata_obj,
        db.Column("ShortUrl", db.String, db.ForeignKey("Links.ShortUrl")),
        db.Column("HostIP", db.String),
        db.Column("Timestamp", db.DateTime(timezone=False), server_default=func.now()),
    )

    engine = create_engine(connection_string, echo=True)
    metadata_obj.create_all(engine)

    @app.get("/hello")
    def hello_world():
        return jsonify({"status": "ok"}), 200

    @app.get("/<url>")
    def redirect_to_long_url(url):
        get_long_url_statement = db.select(links).where(links.c.ShortUrl == url)
        add_to_clicks_statement = clicks.insert().values(
            ShortUrl=url, HostIP=request.remote_addr
        )
        long_url = None

        with engine.connect() as conn:
            result = conn.execute(get_long_url_statement).first()
            if result is None:
                return jsonify({"status": "Not found"}), 404
            print("DEBUG", long_url)
            conn.execute(add_to_clicks_statement)
            long_url = result[1]
            conn.commit()

        return redirect(long_url), 302

    @app.post("/link")
    def create_link():
        url = request.json["url"]
        shortened = shorten(url)
        add_link_statement = links.insert().values(ShortUrl=shortened, LongUrl=url)
        with engine.connect() as conn:
            conn.execute(add_link_statement)
            conn.commit()

        return jsonify({"status": "ok", "shortened": shortened}), 200

    return app


app = create_app()

if __name__ == "__main__":
    # cfg = Config.get_instance()
    port = int(os.getenv("PORT", 8000))
    app.run(host="127.0.0.1", port=port, debug=True)
