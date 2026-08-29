# StudySpark AI

> Turn notes into active recall.

A lightweight AI-powered study assistant that transforms free-form notes or topics into **structured flashcards and multiple-choice quizzes**.

StudySpark AI is designed around a simple principle: **AI output should be treated as untrusted data**. Instead of displaying raw LLM text, the backend requests structured JSON, parses it, validates it with Zod, and only then sends the validated data to the React application for rendering.

🌐 **Live Demo:** https://studyspark-ai-mqw4.onrender.com/

---
##🚀 Getting Started
Prerequisites
Node.js 20.19+ recommended
A Gemini API key
1. Clone the repository
git clone https://github.com/Lovjot47/studyspark-ai.git
cd studyspark-ai
2. Install dependencies
npm install
3. Configure environment variables

Copy the example environment file:

cp .env.example .env

On Windows PowerShell:

Copy-Item .env.example .env

Then add your Gemini API key:

GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-3.5-flash
PORT=3001

Never commit the .env file or expose the API key in frontend code.

4. Start the application
npm start

The application will be available at:

http://localhost:5173

The Express API runs on the configured backend port.

##🧪 Production Build

To verify that the frontend builds successfully:

npm run build

The production build is generated in:

dist/

For production deployment, Express serves the generated React application and API routes from the same service.

🔌 API
Health Check
GET /api/health

Example response:

{
  "ok": true,
  "aiConfigured": true
}
Generate Study Set
POST /api/generate

Request:

{
  "input": "Photosynthesis is the process by which plants convert light energy...",
  "mode": "both"
}

Supported modes:

both
flashcards
quiz

The endpoint returns validated structured JSON containing the study title, summary, flashcards, and quiz questions.

##🔐 Environment Variables

Create a .env file locally:

GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-3.5-flash
PORT=3001


## ✨ Features

### AI-Powered Study Generation

- Paste free-form notes, a topic, or a chapter summary.
- Generate:
  - Flashcards
  - Quiz questions
  - Both
- Uses Google Gemini through a server-side Express API.
- AI responses are requested in a strict structured JSON format.

### Interactive Flashcards

- Flip cards to reveal answers.
- Navigate between cards.
- Shuffle the deck.
- Keyboard-friendly controls.
- Track study progress.

### Interactive Quiz

- Multiple-choice questions with four options.
- Question-by-question progress.
- Score calculation.
- Answer explanations after submission.
- Retake the complete quiz.
- Retry only the questions answered incorrectly.

### Study Sprint

- Built-in focus timer.
- User-selectable durations:
  - 5 minutes
  - 10 minutes
  - 15 minutes
  - 20 minutes
  - 25 minutes
  - 30 minutes
  - 45 minutes
  - 60 minutes
- Pause, resume, and reset controls.

### UI & Accessibility

- Responsive layout for desktop and mobile.
- Dark/light theme toggle.
- Keyboard interaction for flashcards.
- Loading, empty, success, and error states.
- Clear feedback during AI generation.




##🤖 AI Usage Note

AI development tools were used during the development process to help with:

Initial React component structure
UI implementation ideas
CSS/layout refinement
Gemini structured-output integration
Validation strategy
Error-handling patterns
Debugging and deployment troubleshooting
Reviewing implementation decisions


##⏱️ Time Spent

Approximately 6 hours of development time.

The time was primarily spent on:

React UI and component architecture
Gemini API integration
Structured JSON generation
Zod runtime validation
AI failure handling
Stale-request protection
Interactive flashcards
Interactive quiz and retry flow
Study Sprint timer
Responsive UI
Dark/light theme
Testing and debugging
GitHub setup
Production deployment
