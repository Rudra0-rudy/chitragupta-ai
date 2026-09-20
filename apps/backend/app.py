from flask import Flask
from flask_cors import CORS
from routes.analysis import analysis_bp
from supabase import create_client
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create Flask app
app = Flask(__name__)

# Allow frontend to communicate with Flask backend
CORS(app)

# Register API routes
app.register_blueprint(analysis_bp, url_prefix="/api")


@app.route("/")
def home():
    return {
        "message": "Chitragupta AI Backend is running"
    }


@app.route("/api/supabase-test")
def supabase_test():
    response = (
        supabase
        .table("ai_chitra")
        .select("id")
        .limit(1)
        .execute()
    )

    return {
        "status": "success",
        "message": "Supabase connection is working"
    }


if __name__ == "__main__":
    app.run(debug=True)