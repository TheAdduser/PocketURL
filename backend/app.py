import sqlalchemy as db
import os
from flask import Flask, jsonify, request, redirect
from sqlalchemy import create_engine
from sqlalchemy.sql import func
from .services.link_service import shorten
from flask_cors import CORS
from .config import Config


def create_app() -> Flask:
    cfg = Config.get_instance()

    app = Flask(__name__)

    CORS(app)

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

    engine = create_engine(cfg.connection_string, echo=True)
    metadata_obj.create_all(engine)

    @app.get("/health")
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

    @app.get("/links")
    def get_links():
        try:
            page = int(request.args.get("page", 1))
        except ValueError:
            return jsonify({"error": "Page parameter must be an integer"}), 400

        if page < 1:
            return jsonify({"error": "Page number must be a positive integer"}), 400

        offset = (page - 1) * cfg.ELEMENTS_PER_PAGE

        links_total_count_statement = db.select(db.func.count()).select_from(links)

        get_links_page_statement = (
            db.select(
                links.c.ShortUrl,
                links.c.LongUrl,
                func.count(links.c.ShortUrl).label("total_count"),
            )
            .join(clicks, links.c.ShortUrl == clicks.c.ShortUrl, isouter=True)
            .offset(offset)
            .groupby(links.c.ShortUrl)
            .limit(cfg.ELEMENTS_PER_PAGE)
        )

        with engine.connect() as conn:
            links_total_count = conn.execute(links_total_count_statement).scalar()

            if links_total_count is None:
                return jsonify({"status": "Not found"}), 404

            rows = conn.execute(get_links_page_statement).mappings().all()
            result = [dict(row) for row in rows]

            if result is None:
                return jsonify({"status": "Not found"}), 404

        return jsonify(
            {"status": "ok", "links_total_count": links_total_count, "records": result}
        )

    return app


app = create_app()

if __name__ == "__main__":
    cfg = Config.get_instance()
    app.run(host="127.0.0.1", port=cfg.port, debug=True)
