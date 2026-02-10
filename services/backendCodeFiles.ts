export const backendCodeFiles = {
  'app.py': `from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import feature_extractor

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@app.route('/analyze', methods=['POST'])
def analyze_product():
    """
    Main API endpoint.
    Expects JSON: { "url": "https://example.com/product" }
    """
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    # 1. Extract Data (Scraping)
    try:
        product_data = feature_extractor.scrape_product(url)
    except Exception as e:
        return jsonify({"error": f"Extraction failed: {str(e)}"}), 500

    # 2. AI Analysis using Gemini
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Analyze this e-commerce product for fraud risk.
        Product Data: {product_data}
        
        Return a JSON response with:
        - trust_score (0-100)
        - verdict (Genuine, Suspicious, Fake)
        - reasons (list of 3 short explanations)
        
        Focus on: Review sentiment, Seller history, and Price anomalies.
        """
        
        response = model.generate_content(prompt)
        # Parse logic for response.text -> JSON would go here
        
        # Mocking parsed response for demonstration
        result = {
            "trust_score": 82,
            "verdict": "Genuine",
            "reasons": [
                "Seller has long-term positive history",
                "Review sentiment is consistent",
                "Price aligns with market average"
            ]
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)`,

  'feature_extractor.py': `import requests
from bs4 import BeautifulSoup

def scrape_product(url):
    """
    Scrapes basic product details for AI context.
    Real implementation would use specific selectors for Amazon/Flipkart.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Simple extraction logic
    title = soup.title.string if soup.title else "Unknown Product"
    text_content = soup.get_text()[:2000] # First 2000 chars for context
    
    return {
        "url": url,
        "title": title,
        "page_content_snippet": text_content,
        "has_https": url.startswith("https")
    }`
};