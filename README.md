# StudySpark AI — Frontend Internship Assignment

A React study assistant that accepts free-form notes/topics, asks an LLM for structured JSON, validates the response server-side, and renders it as interactive flashcards and a quiz.

## Why this project

This implementation follows the assignment's core requirement: the LLM output is structured data that the application parses and turns into stateful UI, not a chatbot. The app also treats model output as untrusted input and validates it before rendering.

## Stack

- React with hooks and functional components
- Vite
- Express backend
- Google Gemini via `@google/genai`
- Zod for runtime validation
- Plain CSS for a responsive UI

## Prerequisites

Node.js 20.19+ is recommended for the current Vite release.

## Setup

1. Open this folder in VS Code.
2. In the integrated terminal run:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.5-flash
PORT=3001
```

4. Start the app:

```bash
npm start
```

Then open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Usage

Paste notes or a topic, choose Both / Flashcards / Quiz, and select **Generate study set**.

Flashcards are clickable and flip between question and answer.

The quiz tracks answers, gives a score, explains answers after submission, and can re-test only the questions that were missed.

## Failure handling

The app explicitly handles:

- Empty user input
- Missing API configuration
- AI/API failures
- Empty model output
- Malformed JSON
- JSON that does not match the expected schema
- Request cancellation
- Older requests trying to overwrite newer results
- Loading, error, and empty UI states

The frontend keeps a monotonically increasing request id and aborts the previous fetch before starting another request. The server validates the parsed model response with Zod before returning it to the browser.

## AI usage note

AI tools were used to help draft and review portions of the implementation, including React structure, validation strategy, CSS ideas, and error-handling patterns. The final code and decisions should be understood and explained by the submitter.

## Known limitations

- No authentication or persistent saved sessions.
- The app currently uses Gemini; another provider would require changing the backend integration.
- The study content quality still depends on the quality and completeness of the user input and model response.
- The optional stretch features (streaming, save/reload sessions, refinement loop, mixed block types) are not implemented in the core version.

## Time spent

Target: ~8 hours. Replace this line with the actual time spent before submission.

## Interview talking points

1. Why the API key lives on the server.
2. Why structured output alone is not enough and runtime validation is still needed.
3. How stale response protection works.
4. Why model output is treated as untrusted data.
5. How the UI remains useful when generation fails.
