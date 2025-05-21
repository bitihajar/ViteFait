from flask import Blueprint, request, jsonify
from database import db
from datetime import datetime

contact_routes = Blueprint('contact', __name__)

@contact_routes.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Create contact message document
        contact_message = {
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message'],
            'created_at': datetime.utcnow()
        }

        # Insert into database
        result = db.contact_messages.insert_one(contact_message)

        if result.inserted_id:
            return jsonify({
                'message': 'Message sent successfully',
                'id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'error': 'Failed to save message'}), 500

    except Exception as e:
        print('Error in contact submission:', e)
        return jsonify({'error': 'An error occurred while sending your message'}), 500 