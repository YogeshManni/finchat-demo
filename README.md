

FinChat
=======

FinChat is a Next.js-based chat application that integrates OpenAI and the Financial Modeling Prep (FMP) API to deliver financial insights, earnings call summaries, and detailed metrics for various companies. Leveraging modern web technologies, it features a sleek dark-mode UI and efficient backend processing. Currently, the app provides basic financial query capabilities, including company information, financial metrics, and earnings call summaries, with significant potential for enhancement. I plan to expand its features in the near future.

Table of Contents
-----------------

-   [Features](#features)

-   [Tech Stack](#tech-stack)

-   [App Structure](#app-structure)

-   [Prerequisites](#prerequisites)

-   [Installation](#installation)

-   [Running the App](#running-the-app)

-   [Usage](#usage)

-   [Example Prompts](#example-prompts)

-   [Helpful Tips](#helpful-tips)
  
-   [Contact](#contact)

Features
--------

-   Real-time chat interface with a sleek, dark-mode design.

-   Summarizes earnings call transcripts using OpenAI's GPT-4o-mini.

-   Extracts specific financial metrics and commentary from FMP data.

-   Handles dynamic queries for various companies and question types.

-   Typewriter effect for AI responses, enhancing user experience.

-   Structured output with highlighted headings and bullet points.

Tech Stack
----------

-   **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS

-   **Backend**: Next.js API Routes, OpenAI API, FMP API

-   **Bundler**: Turbopack (for faster development)

-   **Logging**: Winston (with console and file output)

-   **Environment**: Node.js

App Structure
-------------

```
Directory structure:
└── finchat-demo/                             # Root directory for the FinChat demo project
    ├── README.md                             # Project documentation - setup instructions and overview
    ├── firebase.json                         # Firebase configuration file for hosting and deployment settings
    ├── next.config.ts                        # Next.js configuration - customizes build and runtime behavior
    ├── package.json                          # Lists dependencies, scripts, and project metadata
    ├── postcss.config.mjs                    # PostCSS config - used with Tailwind for CSS processing
    ├── tailwind.config.ts                    # Tailwind CSS configuration - defines custom styles and themes
    ├── tsconfig.json                         # TypeScript configuration - sets up compiler options
    ├── .firebaserc                           # Firebase project metadata - links to your Firebase project ID
    ├── public/                               # Static assets directory - holds files like images or favicon
    ├── logs/                                 # Logs folder - All logs files will be created here (This folder will be created after user submit's first query)
    ├   ├── combined.log                    # All logs will be visible in this file 
    ├   ├── error.log                       # Only error will be logged in this file
    ├── src/                                  # Source code directory - contains all app logic and UI
    │   ├── app/                              # App Router directory - defines pages and API routes
    │   │   ├── layout.tsx                    # Root layout component - wraps all pages with consistent structure
    │   │   ├── page.tsx                      # Main page component - entry point for the chat UI
    │   │   └── api/                          # API routes directory - handles server-side logic
    │   │       └── query/                    # Query API endpoint folder - processes user prompts
    │   │           └── route.ts              # API route handler - fetches data and calls OpenAI
    │   ├── components/                       # Reusable UI components - organized for the chat interface
    │   │   ├── ChatInput.tsx                 # Input component - captures and submits user messages
    │   │   └── chat-messages/                # Subdirectory for chat message-related components and hooks
    │   │       ├── AudioControls.tsx         # Audio toggle button - controls play/pause for speech
    │   │       ├── ChatMessage.tsx           # Main chat message renderer - displays messages with audio
    │   │       ├── MessageContent.tsx        # Message content formatter - structures text with headers
    │   │       ├── useSpeechSynthesis.ts     # Hook for speech synthesis - manages audio playback
    │   │       └── useTypewriter.ts          # Hook for typewriter effect - animates message display
    │   ├── helpers/                          # Utility helpers - reusable logic and types
    │   │   ├── prompts.ts                    # Prompt templates - defines OpenAI system/user prompts
    │   │   └── types.ts                      # TypeScript types - centralizes interfaces for the app
    │   ├── styles/                           # CSS styles directory - global styling configuration
    │   │   └── globals.css                   # Global CSS file - applies Tailwind and custom styles
    │   └── utils/                            # Utility functions - backend and logging helpers
    │       ├── fmpApi.ts                     # FMP API client - fetches financial data
    │       ├── logger.ts                     # Logging utility - tracks app events and errors
    │       └── openAiApi.ts                  # OpenAI API client - handles categorization and responses
    └── .firebase/                            # Firebase cache directory - auto-generated during deployment
        

```

Prerequisites
-------------

-   **Node.js**: Version 18 or later

-   **npm**: Version 9 or later

-   **Git**: For cloning the repository

-   **API Keys**:

    -   OpenAI API key (sign up at [OpenAI](https://openai.com/))

    -   FMP API key (get it from https://site.financialmodelingprep.com/)

Installation
------------

1.  **Clone the Repository**:

  ```
    git clone https://github.com/YogeshManni/finchat-demo
  ```
3.  **Install Dependencies**:

    ```
    npm install
    ```

5.  **Set Up Environment Variables**:

    -   Create a .env.local file in the root directory:

       ```
        FMP_API_KEY=your-fmp-api-key-here
        OPENAI_API_KEY=your-openai-api-key-here
       ```


Running the App
---------------

1.  **Start the Development Server**:

    -   Uses Turbopack for faster builds:

    ```
        npm run dev
    ```

    -   The app will be available at http://localhost:3000.

3.  **Build for Production** (optional):

     - Build command
         
        ```
        npm run build 
        ```    
     - Ater that production build can be served using this command -
        
        ```
        npm start
        ```

Usage
-----

-   Open http://localhost:3000 in your browser.

-   Type a financial query into the chat input (e.g., "Summarize Spotify's latest conference call").

-   Watch the AI response appear , structured with headings and bullets.

-   You can also click on Play button at bottom of message to hear the response instead of reading it.

Example Prompts
---------------

-   "Summarize Spotify's latest conference call."

-   "What has Airbnb management said about profitability over the last few earnings calls?"

-   "What are Mark Zuckerberg's and Satya Nadella's recent comments about AI?"

-   "How many new large deals did ServiceNow sign in the last quarter?"


Helpful Tips
-------------

 - Review the logs in combined.log and error.log files located in the logs folder. These logs provide a detailed view of the data flow, aiding in better understanding of the application’s behavior. (Note: Logs are generated after the first user query.)
 - In the openAiApi.ts file, you can modify the model to suit your preferences. Additionally, you may adjust the max_tokens value as needed - consider increasing it only if OpenAI’s responses are being truncated.
 - Enhance the prompts in prompt.ts to improve results if you notice the responses are unsatisfactory.

Contact
-------

-   **Author**: Yogesh Manni

-   **GitHub**: [github.com/YogeshManni](https://github.com/YogeshManni)

-   **Email**: yogeshmanni786@gmail.com

-   **Issues**: Report bugs or suggest features on the [GitHub Issues page](https://github.com/YogeshManni/finchat-demo/issues) or email me at yogeshmanni786@gmail.com
