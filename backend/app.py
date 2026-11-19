"""Einstiegspunkt für den Flask-Webserver des Bücherei-Portals."""

from flask import Flask
from flask_cors import CORS

from api.routes import api


def create_app() -> Flask:
    """Erzeugt die Flask-App und registriert die API."""
    app = Flask(__name__)
    CORS(app)  # erlaubt dem Vue-Dev-Server (localhost:5173) den Zugriff
    app.register_blueprint(api)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
