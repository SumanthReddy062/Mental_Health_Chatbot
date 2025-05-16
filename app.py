import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

# Serve Service Worker
@app.route('/sw.js')
def serve_sw():
    return send_from_directory('static', 'sw.js', mimetype='application/javascript')

# Serve Manifest
@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('static', 'manifest.json', mimetype='application/json')

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
try:
    if not GEMINI_API_KEY:
        raise ValueError("❌ GEMINI_API_KEY missing")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat_session = model.start_chat(history=[])
    print("✅ Gemini configured")
except Exception as e:
    print(f"❌ Gemini init failed: {str(e)}")
    model = None

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def handle_chat():
    if not model:
        return jsonify({"error": "AI service unavailable"}), 503
    
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "Empty message"}), 400

        response = chat_session.send_message(data['message'])
        return jsonify({"response": response.text})
    
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 10000)))
