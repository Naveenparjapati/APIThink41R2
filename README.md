# Gemini React Chat Application

This is a chat application built with React and powered by the Google Gemini API. It has been set up to run with Vite, a modern frontend development tool.

## How to Run in VS Code

To run this project on your local machine, you will need [Node.js](https://nodejs.org/) installed.

### 1. Install Dependencies

Open the project folder in VS Code and run the following command in the integrated terminal. This will install all the necessary packages defined in `package.json`.

```bash
npm install
```

### 2. Set Up Your API Key

The application requires a Google Gemini API key to function.

1.  Create a new file in the root of the project named `.env`.
2.  Add your API key to this file. **The variable name must start with `VITE_`** for Vite to recognize it.

    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    *This file is already listed in `.gitignore` to prevent you from accidentally committing your secret key to version control.*

### 3. Start the Development Server

Run the following command to start the Vite development server:

```bash
npm run dev
```

Vite will provide you with a local URL (e.g., `http://localhost:5173`). Open this URL in your web browser to use the chat application.
