from flask import Blueprint, request, jsonify
from database import db  # your MongoDB connection

favorites_routes = Blueprint('favorites', __name__)

@favorites_routes.route('/api/favorites', methods=['POST'])
def add_favorite():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        email = data.get('email')
        product = data.get('product')

        if not email or not product:
            return jsonify({'error': 'Missing email or product data'}), 400

        # Check if already favorited
        existing = db.favorites.find_one({
            'email': email,
            'product.name': product.get('name')
        })
        
        if existing:
            return jsonify({'message': 'Product already in favorites'}), 200

        # Insert new favorite
        result = db.favorites.insert_one({
            'email': email,
            'product': {
                'name': product.get('name'),
                'price': product.get('price'),
                'image': product.get('image'),
                'link': product.get('link')
            }
        })
        
        return jsonify({
            'message': 'Product added to favorites successfully',
            'id': str(result.inserted_id)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@favorites_routes.route('/api/favorites', methods=['GET'])
def get_favorites():
    try:
        email = request.args.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        favorites = list(db.favorites.find(
            {'email': email},
            {'_id': 0, 'email': 0}  # Exclude these fields from response
        ))
        return jsonify([fav['product'] for fav in favorites]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@favorites_routes.route('/api/favorites/remove', methods=['POST'])
def remove_favorite():
    try:
        data = request.get_json()
        email = data.get('email')
        product = data.get('product')

        if not email or not product:
            return jsonify({'error': 'Missing email or product data'}), 400

        result = db.favorites.delete_one({
            'email': email,
            'product.name': product.get('name')
        })
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Product not found in favorites'}), 404

        return jsonify({'message': 'Product removed from favorites'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500