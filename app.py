import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Configuration - Prioritize Render's environment variables over .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Matches Render's environment variable name

# Initialize Gemini
try:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')  # Updated to latest model
    chat_session = model.start_chat(history=[])
except Exception as e:
    app.logger.error(f"Gemini initialization failed: {str(e)}")
    model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def handle_chat():
    if not model:
        return jsonify({
            'error': 'Service unavailable',
            'message': 'AI service is not properly configured'
        }), 503

    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                'error': 'Invalid request',
                'message': 'Message field is required'
            }), 400

        # Enhanced mental wellness prompt
        prompt = f"""You are SereneMind, a compassionate mental wellness assistant. Provide:
        1. Empathetic listening
        2. Non-judgmental support
        3. Gentle suggestions (not medical advice)
        4. Crisis resources when needed

        User: {data['message']}
        Assistant:"""

        response = chat_session.send_message(prompt)
        return jsonify({
            'response': response.text,
            'status': 'success'
        })

    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        return jsonify({
            'error': 'Processing error',
            'message': 'Please try again later'
        }), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 10000)),  # Render-compatible port
        debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    )
