import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Set up logging for debugging
logging.basicConfig(level=logging.INFO)

# AIML API details
API_KEY = "6ed1008879fc4c8a8904e99dd1b29542"
BASE_URL = "https://api.aimlapi.com/v1/chat/completions"

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

SYSTEM_PROMPT = """
You are a financial assistant chatbot for a FinTech company.
You provide accurate information about loans, interest rates, credit bureaus, credit reports, and CIBIL.
Ensure responses are factual, concise, and helpful.
"""

@app.route("/", methods=["GET"])
def home():
    return "Welcome to the We Credit Assistant Chatbot API!"

@app.route("/chat", methods=["POST"])
def chat():
    # Validate Content-Type
    if request.content_type != "application/json":
        return jsonify({"error": "Unsupported Media Type: Use application/json"}), 415

    # Get request data
    data = request.get_json()
    if not data or "user_message" not in data:
        return jsonify({"error": "Invalid request, missing 'user_message'"}), 400

    user_message = data["user_message"]

    # Prepare API request
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7
    }
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(BASE_URL, json=payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()

        # Extract AI response
        ai_response = response_data.get("choices", [{}])[0].get("message", {}).get("content", "No response received.")

        return jsonify({"response": ai_response})

    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {e}")
        return jsonify({"error": "Failed to connect to AIML API"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)
