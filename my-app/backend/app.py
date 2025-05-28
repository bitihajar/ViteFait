from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from routes.compare import compare_routes
from routes.auth import auth_routes
from routes.favorites import favorites_routes
from routes.promotions import promotions_routes
from routes.contact import contact_routes
import os

app = Flask(__name__)

# CORS configuration - allow your frontend domain
CORS(app, origins=["https://gentle-smoke-0fd24101e.6.azurestaticapps.net"])

# MongoDB Atlas configuration
# Replace <db_password> with your actual database password
mongo_uri = os.environ.get('MONGO_URI', 'mongodb+srv://nizartalbany4:<db_password>@cluster0.jz8qxxs.mongodb.net/vitefait?retryWrites=true&w=majority&appName=Cluster0')
app.config["MONGO_URI"] = mongo_uri

try:
    mongo = PyMongo(app)
    app.mongo = mongo  # Make it accessible in routes via current_app.mongo
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

# Register routes
app.register_blueprint(compare_routes)
app.register_blueprint(auth_routes)
app.register_blueprint(favorites_routes)
app.register_blueprint(promotions_routes)
app.register_blueprint(contact_routes)

@app.route("/")
def home():
    return {"message": "Flask backend is running with MongoDB Atlas"}

@app.route("/health")
def health_check():
    try:
        # Test MongoDB connection
        mongo.db.list_collection_names()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}, 500

if __name__ == "__main__":
    app.run(debug=True)