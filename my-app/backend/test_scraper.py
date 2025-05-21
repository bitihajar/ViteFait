import requests
import json

def test_scraper():
    # Test with a simple product query
    query = "iphone"
    response = requests.get(f"http://localhost:5000/api/compare?product={query}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nResults for '{query}':")
        print("------------------------")
        
        for product in data['results']:
            print(f"\nSource: {product['source']}")
            print(f"Name: {product['name']}")
            print(f"Price: {product['price']}")
            print(f"Link: {product['link']}")
            print("------------------------")
            
        print(f"\nTotal results: {len(data['results'])}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_scraper() 