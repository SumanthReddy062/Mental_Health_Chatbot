import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Production-ready configuration
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]  # Enforces key existence

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat_session = model.start_chat(history=[])
except Exception as e:
    app.logger.error(f"Gemini init failed: {str(e)}")
    model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({
            "error": "AI service unavailable",
            "message": "Technical difficulties. Please try later."
        }), 503

    try:
        message = request.json.get('message')
        if not message:
            return jsonify({"error": "Empty message"}), 400

        response = chat_session.send_message(message)
        return jsonify({"response": response.text})
    
    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 10000)))
