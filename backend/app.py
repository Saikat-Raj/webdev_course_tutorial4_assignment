# backend/app.py
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app, origins=["http://localhost:3000"])

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "healthy", "message": "Registration API is running"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
