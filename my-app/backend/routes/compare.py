from flask import Blueprint, request, jsonify
from scraper.jumia import scrape_jumia

compare_routes = Blueprint("compare", __name__)

@compare_routes.route('/api/compare')
def compare_prices():
    query = request.args.get('product')
    if not query:
        return jsonify({'error': 'Product query is required'}), 400

    # Get results from Jumia
    jumia_results = scrape_jumia(query)

    return jsonify({
        'product': query,
        'results': jumia_results
    })
