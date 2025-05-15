import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)

# Configure Gemini API
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file or environment variables.")
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    chat_session = model.start_chat(history=[]) # Initialize a chat session for conversation history
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None # Set model to None if configuration fails

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({'response': "Error: Gemini API is not configured. Please check the server logs."}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # System prompt for mental wellness context
    # You can customize this prompt to better suit your application's persona and purpose.
    prompt_template = f"""You are a compassionate and supportive mental wellness chatbot.
Your goal is to provide a safe space for users to express their feelings and to offer helpful, empathetic, and non-judgmental responses.
Do not provide medical advice or diagnoses. If a user seems to be in distress or mentions self-harm, gently encourage them to seek help from a mental health professional or a trusted person.
User: {user_message}
AI:"""

    try:
        # Send message to Gemini API using the chat session for context
        response = chat_session.send_message(prompt_template)
        bot_response = response.text
    except Exception as e:
        print(f"Error communicating with Gemini API: {e}")
        bot_response = "I'm having a little trouble connecting right now. Please try again in a moment."

    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
