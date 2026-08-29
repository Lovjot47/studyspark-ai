import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { GoogleGenAI, Type } from '@google/genai'
import { z } from 'zod'

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json({ limit: '100kb' }))

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null

const studySchema = z.object({
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(500),
  cards: z.array(z.object({
    id: z.string().min(1),
    question: z.string().min(1).max(500),
    answer: z.string().min(1).max(1000),
    hint: z.string().max(250).default('')
  })).min(3).max(8),
  quiz: z.array(z.object({
    id: z.string().min(1),
    question: z.string().min(1).max(500),
    options: z.array(z.string().min(1).max(300)).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().min(1).max(500)
  })).min(3).max(8),// Adjusted to require exactly 5 quiz questions
})

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          hint: { type: Type.STRING }
        },
        required: ['id', 'question', 'answer', 'hint']
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ['id', 'question', 'options', 'correctIndex', 'explanation']
      }
    }
  },
  required: ['title', 'summary', 'cards', 'quiz']
}

const buildPrompt = ({ input, mode }) => `
You are the content engine for an interactive study assistant.

The user provided free-form study material below.
Mode requested: ${mode === 'quiz' ? 'quiz-focused' : mode === 'flashcards' ? 'flashcard-focused' : 'both'}.

USER MATERIAL:
${input}

Return ONLY JSON matching the provided schema.
Do not wrap JSON in markdown fences.
Do not invent facts that are not reasonably supported by the user material. If the material is sparse, use general knowledge only to make the questions coherent, but keep them introductory.
Create 3-12 flashcards and 3-10 multiple-choice questions.
Each quiz question must have exactly four options and one correctIndex from 0 to 3.
Keep IDs unique and simple, for example card-1 and quiz-1.
The output will be parsed by application code, so strict schema compliance is mandatory.
`

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(ai) })
})

app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : ''
  const mode = req.body?.mode || 'both'

  if (!input) {
    return res.status(400).json({ error: 'Please enter some notes or a topic first.' })
  }
  if (input.length > 8000) {
    return res.status(400).json({ error: 'Please keep your input under 12,000 characters.' })
  }
  if (!['both', 'flashcards', 'quiz'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid study mode.' })
  }
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' })
  }

  try {
    const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  contents: buildPrompt({ input, mode }),
  config: {
    responseMimeType: 'application/json',
    responseSchema,
    thinkingConfig: {
      thinkingLevel: 'low'
    },
    maxOutputTokens: 2500
  }
})
    

    const raw = response.text?.trim()
    if (!raw) {
      return res.status(502).json({ error: 'The model returned an empty response. Please retry.' })
    }

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return res.status(502).json({ error: 'The model returned malformed JSON. Please retry.' })
    }

    const validated = studySchema.safeParse(parsed)
    if (!validated.success) {
      console.error('Schema validation failed:', validated.error.flatten())
      return res.status(502).json({ error: 'The model returned data in an unexpected shape. Please retry.' })
    }

    res.json(validated.data)
  } catch (error) {
    console.error('Generation failed:', error)
    const message = error instanceof Error ? error.message : 'Unknown AI error'
    res.status(502).json({ error: `AI generation failed: ${message}` })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
