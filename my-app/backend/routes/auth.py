from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient

auth_routes = Blueprint('auth', __name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['vitefait']
users_collection = db['users']

@auth_routes.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        'name': name,
        'email': email,
        'password': hashed_password
    })

    return jsonify({'message': 'User created successfully'}), 201

@auth_routes.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'message': 'Login successful', 'name': user['name']}), 200
