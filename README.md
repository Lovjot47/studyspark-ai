# StudySpark AI

> Turn notes into active recall.

A lightweight AI-powered study assistant that transforms free-form notes or topics into **structured flashcards and multiple-choice quizzes**.

StudySpark AI is designed around a simple principle: **AI output should be treated as untrusted data**. Instead of displaying raw LLM text, the backend requests structured JSON, parses it, validates it with Zod, and only then sends the validated data to the React application for rendering.

🌐 **Live Demo:** https://studyspark-ai-mqw4.onrender.com/

---

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




🤖 AI Usage Note

AI development tools were used during the development process to help with:

Initial React component structure
UI implementation ideas
CSS/layout refinement
Gemini structured-output integration
Validation strategy
Error-handling patterns
Debugging and deployment troubleshooting
Reviewing implementation decisions


⏱️ Time Spent

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
