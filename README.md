# Mental Wellness Chat Application

A simple web-based chat application using Python (Flask) and the Gemini API for mental wellness support.

## Setup

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```

2.  **Activate the virtual environment:**
    *   Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    *   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up your Gemini API Key:**
    Create a `.env` file in the root directory of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

5.  **Run the application:**
    ```bash
    python app.py
    ```

Open your browser and go to `http://127.0.0.1:5000/`.
