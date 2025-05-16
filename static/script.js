<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SereneMind | Mental Health Chatbot</title>
    <meta name="description" content="A compassionate AI companion for mental wellness">
    
    <!-- PWA Essentials -->
    <meta name="theme-color" content="#0ea5e9">
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" href="/static/icon-192.png" type="image/png">
    
    <!-- Styles -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            color: #1e293b;
        }
        .app-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        #chatBox {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            background: white;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .message {
            margin: 8px 0;
            padding: 12px;
            border-radius: 12px;
            max-width: 80%;
        }
        .user-message {
            background-color: #0ea5e9;
            color: white;
            margin-left: auto;
        }
        .bot-message {
            background-color: #e2e8f0;
            margin-right: auto;
        }
        .input-area {
            display: flex;
            gap: 8px;
        }
        #userInput {
            flex: 1;
            padding: 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            resize: none;
            min-height: 50px;
            max-height: 150px;
        }
        #sendButton {
            padding: 0 20px;
            background-color: #0ea5e9;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <header>
            <h1>SereneMind</h1>
            <p>Your compassionate AI companion</p>
        </header>
        
        <div id="chatBox"></div>
        
        <div class="input-area">
            <textarea id="userInput" placeholder="Share what's on your mind..."></textarea>
            <button id="sendButton">Send</button>
        </div>
    </div>

    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    </script>

    <!-- Chat Functionality (Your Original Code) -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const chatBox = document.getElementById('chatBox');
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');

            function adjustTextareaHeight() {
                userInput.style.height = 'auto';
                userInput.style.height = (userInput.scrollHeight) + 'px';
            }

            userInput.addEventListener('input', adjustTextareaHeight);

            function addMessage(message, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
                messageDiv.textContent = message;
                chatBox.appendChild(messageDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
                adjustTextareaHeight();
            }

            async function sendMessage() {
                const messageText = userInput.value.trim();
                if (messageText === '') return;

                addMessage(messageText, 'user');
                userInput.value = '';
                adjustTextareaHeight();

                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: messageText }),
                    });

                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const data = await response.json();
                    addMessage(data.response, 'bot');
                } catch (error) {
                    console.error('Error:', error);
                    addMessage("I'm having trouble connecting. Please try again later.", 'bot');
                }
            }

            sendButton.addEventListener('click', sendMessage);
            userInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            });

            // Initial message
            addMessage("Hello! I'm your mental wellness assistant. How can I help you today?", "bot");
        });
    </script>
</body>
</html>