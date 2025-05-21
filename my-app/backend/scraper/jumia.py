import requests
from bs4 import BeautifulSoup
import re

def clean_text(text):
    # Remove extra whitespace and newlines
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def scrape_jumia(query):
    url = f"https://www.jumia.ma/catalog/?q={query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
    }

    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        products = []

        for item in soup.select("article.prd"):
            try:
                name = item.select_one(".name")
                price = item.select_one(".prc")
                link_tag = item.find("a", href=True)
                image_tag = item.select_one("img")

                if name and price and link_tag:
                    # Skip products that redirect to login
                    if "login" in link_tag["href"] or "customer/account" in link_tag["href"]:
                        continue

                    # Clean up the product name
                    product_name = clean_text(name.text)
                    if not product_name:
                        continue

                    # Clean up the price
                    price_text = clean_text(price.text)
                    if not price_text or "login" in price_text.lower():
                        continue

                    # Clean up the link
                    product_link = link_tag["href"]
                    if not product_link.startswith("http"):
                        product_link = "https://www.jumia.ma" + product_link
                    
                    # Skip if the link contains login or customer account
                    if "login" in product_link or "customer/account" in product_link:
                        continue

                    # Get the image URL
                    image_url = ""
                    if image_tag:
                        image_url = image_tag.get("data-src") or image_tag.get("src", "")

                    products.append({
                        "name": product_name,
                        "price": price_text,
                        "link": product_link,
                        "image": image_url,
                        "source": "Jumia"
                    })
            except Exception as e:
                print(f"Error processing Jumia item: {str(e)}")
                continue

        return products
    except Exception as e:
        print(f"Error scraping Jumia: {str(e)}")
        return []
