from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from routes.compare import compare_routes
from routes.auth import auth_routes
from routes.favorites import favorites_routes
from routes.promotions import promotions_routes
from routes.contact import contact_routes



app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/vitefait"
mongo = PyMongo(app)
app.mongo = mongo  # Make it accessible in routes via current_app.mongo

# Register routes
app.register_blueprint(compare_routes)
app.register_blueprint(auth_routes)
app.register_blueprint(favorites_routes)
app.register_blueprint(promotions_routes)
app.register_blueprint(contact_routes)

@app.route("/")
def home():
    return {"message": "Flask backend is running"}

if __name__ == "__main__":
    app.run(debug=True)
