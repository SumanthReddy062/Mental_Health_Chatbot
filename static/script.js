
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    function adjustTextareaHeight() {
        userInput.style.height = 'auto'; // Reset height to recalculate
        userInput.style.height = (userInput.scrollHeight) + 'px';
    }

    userInput.addEventListener('input', adjustTextareaHeight);

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        // Sanitize message text to prevent XSS if rendering as HTML,
        // or ensure it's treated as text. For now, textContent is safe.
        messageDiv.textContent = message; 
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
        adjustTextareaHeight(); // Adjust textarea after message is added if needed
    }

    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessage(messageText, 'user');
        userInput.value = '';
        adjustTextareaHeight(); // Reset textarea height after sending

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (event) => { // Changed to keydown for better control
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default Enter behavior (new line in textarea)
            sendMessage();
        }
        // Shift+Enter will naturally create a new line, no specific handling needed unless we want to limit lines or something.
    });

    // Initial bot message
    addMessage("Hello! I'm your mental wellness assistant. How can I help you today?", "bot");
    adjustTextareaHeight(); // Adjust for initial content if any (though it's empty)
});
