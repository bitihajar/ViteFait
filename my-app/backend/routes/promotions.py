from flask import Blueprint, jsonify, request
from scraper.jumia import scrape_jumia

promotions_routes = Blueprint("promotions", __name__)

@promotions_routes.route('/api/promotions')
def get_promotions():
    try:
        # Get category from query parameters, default to "Informatique"
        category = request.args.get('category', 'Informatique')
        
        # Scrape products for the specified category
        promo_products = scrape_jumia(category)
        
        if not promo_products:
            return jsonify({"message": f"No promotions found for category: {category}", "products": []}), 200
            
        return jsonify({"products": promo_products})
    except Exception as e:
        print("Error while scraping promotions:", e)
        return jsonify({"error": "Failed to fetch promotions"}), 500
