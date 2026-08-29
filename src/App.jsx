import { useEffect, useMemo, useRef, useState } from 'react'

const examples = [
  'Photosynthesis: chlorophyll absorbs light energy. Plants use carbon dioxide and water to make glucose and release oxygen.',
  'JavaScript closures: a function remembers variables from its lexical scope even after the outer function has returned.',
  'World War II causes: expansionism, unresolved tensions after WWI, aggressive nationalism, and failures of collective security.'
]

function Icon({ name, size = 18 }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>,
    moon: <path d="M20.4 14.7A8.7 8.7 0 0 1 9.3 3.6 8.7 8.7 0 1 0 20.4 14.7Z" />,
    spark: <><path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /><path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6L19 17Z" /></>,
    shuffle: <><path d="M3 6h3c3 0 5 6 8 6h7" /><path d="m18 9 3 3-3 3" /><path d="M3 18h3c1.8 0 3.1-1.3 4.2-2.8" /><path d="M15.8 8.8C16.8 7.3 18 6 21 6" /><path d="m18 3 3 3-3 3" /></>,
    arrowLeft: <path d="m15 18-6-6 6-6M9 12h12" />,
    arrowRight: <path d="m9 18 6-6-6-6M3 12h12" />,
    check: <path d="m5 12 4 4L19 6" />,
    rotate: <><path d="M20 11a8.1 8.1 0 0 0-15.5-3" /><path d="M4 4v5h5" /><path d="M4 13a8.1 8.1 0 0 0 15.5 3" /><path d="M20 20v-5h-5" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Spinner() {
  return <span className="spinner" aria-label="Loading" />
}

function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-icon">{isDark ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}</span>
      <span>{isDark ? 'Light' : 'Dark'}</span>
      <span className={`switch ${isDark ? 'on' : ''}`} aria-hidden="true"><span /></span>
    </button>
  )
}

function FocusSession() {
  const DURATIONS = [5, 10, 15, 20, 25, 30, 45, 60]

  const [enabled, setEnabled] = useState(
    () => localStorage.getItem('studyspark-focus') === 'true'
  )

  const [selectedMinutes, setSelectedMinutes] = useState(() => {
    const saved = Number(localStorage.getItem('studyspark-duration'))
    return DURATIONS.includes(saved) ? saved : 25
  })

  const [seconds, setSeconds] = useState(selectedMinutes * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    localStorage.setItem('studyspark-focus', String(enabled))
    document.documentElement.dataset.focus = enabled ? 'on' : 'off'
  }, [enabled])

  useEffect(() => {
    localStorage.setItem('studyspark-duration', String(selectedMinutes))
  }, [selectedMinutes])

  useEffect(() => {
    if (!enabled || !running) return

    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [enabled, running])

  const handleDurationChange = (minutes) => {
    setSelectedMinutes(minutes)
    setSeconds(minutes * 60)
    setRunning(false)
  }

  const toggleFocus = () => {
    setEnabled((current) => {
      const next = !current
      if (next) {
        setSeconds(selectedMinutes * 60)
        setRunning(true)
      } else {
        setRunning(false)
      }
      return next
    })
  }

  const toggleRunning = () => {
    if (seconds === 0) {
      setSeconds(selectedMinutes * 60)
      setRunning(true)
      return
    }
    setRunning((current) => !current)
  }

  const resetSession = () => {
    setSeconds(selectedMinutes * 60)
    setRunning(false)
  }

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
  const totalSeconds = selectedMinutes * 60
  const progress = totalSeconds > 0
    ? ((totalSeconds - seconds) / totalSeconds) * 100
    : 0
  const isComplete = seconds === 0

  return (
    <div className={`study-sprint ${enabled ? 'is-active' : ''}`}>
      <div className="sprint-header">
        <div className="sprint-icon">
          <Icon name="target" size={16} />
        </div>
        <div className="sprint-title">
          <span>STUDY SPRINT</span>
          <strong>
            {enabled
              ? isComplete
                ? 'Done!'
                : `${minutes}:${remainingSeconds}`
              : `${selectedMinutes} min`}
          </strong>
        </div>
        <button
          type="button"
          className={`sprint-toggle ${enabled ? 'on' : ''}`}
          onClick={toggleFocus}
          aria-pressed={enabled}
          aria-label={enabled ? 'Turn study sprint off' : 'Start study sprint'}
        >
          <span />
        </button>
      </div>

      {!enabled && (
        <div className="duration-selector">
          <span className="duration-label">SESSION LENGTH</span>
          <div className="duration-options">
            {DURATIONS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={selectedMinutes === minutes ? 'duration-option selected' : 'duration-option'}
                onClick={() => handleDurationChange(minutes)}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      )}

      {enabled && (
        <>
          <div className="sprint-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="sprint-status">
            <span>
              {isComplete
                ? 'Session complete 🎉'
                : running
                  ? `${selectedMinutes}-minute focus session`
                  : 'Session paused'}
            </span>
            <span className="sprint-time-label">{selectedMinutes} min</span>
          </div>
          <div className="sprint-actions">
            <button type="button" onClick={toggleRunning} className="sprint-primary-action">
              {isComplete ? 'Restart' : running ? 'Pause' : 'Resume'}
            </button>
            <button type="button" onClick={resetSession} className="sprint-reset">Reset</button>
          </div>
          <div className="active-duration">
            <span>Change duration</span>
            <select
              value={selectedMinutes}
              onChange={(event) => handleDurationChange(Number(event.target.value))}
              aria-label="Change study session duration"
            >
              {DURATIONS.map((minutes) => (
                <option key={minutes} value={minutes}>{minutes} minutes</option>
              ))}
            </select>
          </div>
        </>
      )}

      {!enabled && (
        <div className="sprint-idle">
          <span>Choose your study time</span>
          <button type="button" onClick={toggleFocus}>Start</button>
        </div>
      )}
    </div>
  )
}

function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="error-banner" role="alert">
      <div className="error-copy"><strong>Something went wrong.</strong><span>{message}</span></div>
      {onRetry && <button className="button button-small" onClick={onRetry}>Retry</button>}
    </div>
  )
}

function StatCard({ label, value, icon, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon name={icon} size={17} /></div>
      <div><strong>{value}</strong><span>{label}</span></div>
      {detail && <small>{detail}</small>}
    </div>
  )
}

function Flashcard({ card, isActive, onFlip, onPrevious, onNext, index, total }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => setFlipped(false), [card.id])

  useEffect(() => {
    if (!isActive) return
    const onKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        setFlipped((v) => !v)
      }
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive, onNext, onPrevious])

  const flip = () => {
    setFlipped((v) => !v)
    onFlip?.()
  }

  return (
    <div className="flashcard-stage">
      <button
        type="button"
        className={`flashcard ${flipped ? 'is-flipped' : ''}`}
        onClick={flip}
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <div className="card-topline">
          <span className="flashcard-label">{flipped ? 'ANSWER' : 'QUESTION'}</span>
          <span className="card-count">{index + 1} / {total}</span>
        </div>
        <strong>{flipped ? card.answer : card.question}</strong>
        {!flipped && card.hint && <span className="hint">Hint · {card.hint}</span>}
        <span className="flip-hint"><Icon name="rotate" size={13} /> Space / click to flip</span>
      </button>
      <div className="deck-controls">
        <button type="button" className="icon-button" onClick={onPrevious} disabled={index === 0} aria-label="Previous flashcard"><Icon name="arrowLeft" /></button>
        <div className="deck-dots" aria-label={`Flashcard ${index + 1} of ${total}`}>
          {Array.from({ length: total }).map((_, dotIndex) => <span key={dotIndex} className={dotIndex === index ? 'active' : ''} />)}
        </div>
        <button type="button" className="icon-button" onClick={onNext} disabled={index === total - 1} aria-label="Next flashcard"><Icon name="arrowRight" /></button>
      </div>
    </div>
  )
}

function FlashcardDeck({ cards }) {
  const [current, setCurrent] = useState(0)
  const [shuffled, setShuffled] = useState(false)
  const [order, setOrder] = useState(cards.map((_, index) => index))

  useEffect(() => {
    setCurrent(0)
    setOrder(cards.map((_, index) => index))
  }, [cards])

  const visibleCards = order.map((index) => cards[index])
  const card = visibleCards[current]

  const next = () => setCurrent((value) => Math.min(value + 1, visibleCards.length - 1))
  const previous = () => setCurrent((value) => Math.max(value - 1, 0))

  const shuffle = () => {
    const nextOrder = [...order]
    for (let i = nextOrder.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]]
    }
    setOrder(nextOrder)
    setCurrent(0)
    setShuffled(true)
  }

  return (
    <div className="deck-wrap">
      <div className="deck-toolbar">
        <div><span className="eyebrow">FLASHCARD DECK</span><strong>{current + 1} of {visibleCards.length} cards</strong></div>
        <button type="button" className={`toolbar-button ${shuffled ? 'active' : ''}`} onClick={shuffle}><Icon name="shuffle" size={15} /> Shuffle</button>
      </div>
      <Flashcard card={card} isActive onPrevious={previous} onNext={next} index={current} total={visibleCards.length} />
      <p className="keyboard-tip">Tip: use <kbd>←</kbd> <kbd>→</kbd> to move between cards and <kbd>Space</kbd> to flip.</p>
    </div>
  )
}

function Quiz({ questions }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [retryWrongOnly, setRetryWrongOnly] = useState(false)

  const visibleQuestions = useMemo(() => {
    if (!retryWrongOnly) return questions
    return questions.filter((q) => answers[q.id] !== q.correctIndex)
  }, [questions, answers, retryWrongOnly])

  const score = questions.reduce((total, q) => total + (answers[q.id] === q.correctIndex ? 1 : 0), 0)
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / questions.length) * 100)

  const submit = () => setSubmitted(true)
  const reset = (wrongOnly = false) => {
    setAnswers({})
    setSubmitted(false)
    setRetryWrongOnly(wrongOnly)
  }

  if (retryWrongOnly && visibleQuestions.length === 0) {
    return (
      <div className="success-card">
        <div className="success-icon"><Icon name="check" size={20} /></div>
        <span className="eyebrow">MASTERED</span>
        <h3>Perfect recovery</h3>
        <p>You have no missed questions left. Nice work.</p>
        <button className="button" onClick={() => reset(false)}>Review full quiz</button>
      </div>
    )
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress panel">
        <div><span>Quiz progress</span><strong>{answeredCount}/{questions.length}</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>

      {submitted && (
        <div className="score-card">
          <div className="score-ring" style={{ '--score': `${Math.round((score / questions.length) * 100)}%` }}><strong>{score}</strong><span>/{questions.length}</span></div>
          <div className="score-copy"><span className="eyebrow">YOUR SCORE</span><h3>{score === questions.length ? 'Perfect score!' : score >= questions.length * .7 ? 'Great work!' : 'Keep practicing.'}</h3><p>{score === questions.length ? 'You nailed every question.' : `${questions.length - score} question${questions.length - score === 1 ? '' : 's'} to review.`}</p></div>
          <div className="score-actions">
            <button className="button button-secondary" onClick={() => reset(false)}>Retake all</button>
            {score < questions.length && <button className="button" onClick={() => reset(true)}>Retry wrong</button>}
          </div>
        </div>
      )}

      <div className="quiz-list">
        {visibleQuestions.map((q, index) => {
          const chosen = answers[q.id]
          const correct = chosen === q.correctIndex
          return (
            <section className="quiz-card" key={q.id}>
              <div className="question-meta"><span>Question {index + 1}</span><span>{chosen !== undefined ? 'Answered' : 'Open'}</span></div>
              <h3>{q.question}</h3>
              <div className="options">
                {q.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex
                  const isCorrect = submitted && optionIndex === q.correctIndex
                  const isWrongChoice = submitted && isChosen && !correct
                  return (
                    <label key={option} className={`option ${isChosen ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrongChoice ? 'wrong' : ''}`}>
                      <input type="radio" name={q.id} value={optionIndex} checked={isChosen} onChange={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: optionIndex }))} />
                      <span>{option}</span>
                      {isCorrect && <Icon name="check" size={16} />}
                    </label>
                  )
                })}
              </div>
              {submitted && <p className={`explanation ${correct ? 'good' : 'bad'}`}>{correct ? 'Correct · ' : 'Not quite · '}{q.explanation}</p>}
            </section>
          )
        })}
      </div>

      {!submitted && <button className="button submit-button" onClick={submit} disabled={visibleQuestions.some((q) => answers[q.id] === undefined)}>Submit quiz <Icon name="arrowRight" size={16} /></button>}
    </div>
  )
}

export default function App() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('both')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('cards')
  const [theme, setTheme] = useState(() => localStorage.getItem('studyspark-theme') || 'light')
  const requestId = useRef(0)
  const controllerRef = useRef(null)
  const lastRequest = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('studyspark-theme', theme)
  }, [theme])

  const generate = async (overrideInput = input, overrideMode = mode) => {
    const cleanInput = overrideInput.trim()
    if (!cleanInput) {
      setError('Add notes or a topic before generating a study set.')
      return
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const currentRequestId = ++requestId.current
    lastRequest.current = { input: cleanInput, mode: overrideMode }
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: cleanInput, mode: overrideMode }),
        signal: controller.signal
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || 'The server could not generate a study set.')
      if (currentRequestId !== requestId.current) return
      if (!body.cards || !body.quiz || !body.title) throw new Error('Received an invalid study set. Please retry.')
      setResult(body)
      setActiveTab(overrideMode === 'quiz' ? 'quiz' : 'cards')
    } catch (err) {
      if (err.name === 'AbortError') return
      if (currentRequestId === requestId.current) setError(err.message || 'Unexpected error. Please retry.')
    } finally {
      if (currentRequestId === requestId.current) setLoading(false)
    }
  }

  const retry = () => {
    const request = lastRequest.current
    if (request) generate(request.input, request.mode)
  }

  const clear = () => {
    controllerRef.current?.abort()
    setResult(null)
    setError('')
    setActiveTab('cards')
  }

  return (
    <main className="app-shell">
      <div className="topbar">
        <div className="brand-wrap"><div className="brand-mark">S</div><div><span className="brand-name">StudySpark AI</span><span className="brand-sub">INTERACTIVE STUDY TOOL</span></div></div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><span className="live-dot" /> AI-POWERED LEARNING</span>
          <h1>Turn notes into <em>active recall.</em></h1>
          <p>Paste a topic or your notes. StudySpark turns them into interactive flashcards and a quiz you can re-test.</p>
          <div className="hero-pills"><span><Icon name="spark" size={14} /> Structured AI</span><span><Icon name="check" size={14} /> Validated output</span><span><Icon name="target" size={14} /> Practice-first</span></div>
        </div>
        <div className="hero-visual"><div className="orb orb-one" /><div className="orb orb-two" /><FocusSession /></div>
      </section>

      <section className="composer panel">
        <div className="composer-header">
          <div><span className="step-label">01 · CREATE</span><h2>What are you studying?</h2><p>Paste notes, a chapter summary, or just a topic.</p></div>
          <div className="mode-toggle" role="group" aria-label="Study mode">
            {['both', 'flashcards', 'quiz'].map((option) => <button key={option} type="button" className={mode === option ? 'active' : ''} onClick={() => setMode(option)}>{option === 'both' ? 'Both' : option === 'flashcards' ? 'Flashcards' : 'Quiz'}</button>)}
          </div>
        </div>

        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Example: Explain the OSI model..." maxLength={8000} />
        <div className="composer-footer">
          <div className="input-meta"><span>{input.length.toLocaleString()}/8,000 characters</span><span className="input-status"><span /> Ready</span></div>
          <button className="button generate-button" onClick={() => generate()} disabled={loading || !input.trim()}>{loading ? <><Spinner /> Generating…</> : <><Icon name="spark" size={16} /> Generate study set</>}</button>
        </div>
      </section>

      {error && <ErrorBanner message={error} onRetry={retry} />}

      {!result && !loading && !error && (
        <section className="empty-state panel">
          <div className="empty-header"><div className="empty-icon"><Icon name="spark" size={21} /></div><div><span className="step-label">02 · TRY IT</span><h2>Start with an idea</h2><p>Pick a sample or paste your own notes to see the interactive experience.</p></div></div>
          <div className="example-grid">{examples.map((example, index) => <button key={example} type="button" onClick={() => { setInput(example); generate(example, mode) }}><span className="example-number">0{index + 1}</span><span>{example}</span><Icon name="arrowRight" size={15} /></button>)}</div>
        </section>
      )}

      {loading && <section className="loading-card panel" aria-live="polite"><div className="loading-orbit"><Spinner /></div><div><span className="eyebrow">AI WORKING</span><strong>Building your study set…</strong><p>Generating structured content and validating it before rendering.</p></div><div className="loading-dots"><span /><span /><span /></div></section>}

      {result && !loading && (
        <section className="results">
          <div className="result-heading panel">
            <div className="result-title"><div className="result-icon"><Icon name="spark" size={18} /></div><div><span className="eyebrow">AI-GENERATED STUDY SET</span><h2>{result.title}</h2><p>{result.summary}</p></div></div>
            <button className="button button-secondary" onClick={clear}>Clear</button>
          </div>

          <div className="stats-grid"><StatCard icon="target" value={result.cards.length} label="Flashcards" detail="Active recall" /><StatCard icon="check" value={result.quiz.length} label="Quiz questions" detail="Multiple choice" /><StatCard icon="spark" value="AI" label="Generated" detail="Schema validated" /></div>

          <div className="tabs panel"><button className={activeTab === 'cards' ? 'active' : ''} onClick={() => setActiveTab('cards')}><span>Flashcards</span><span className="tab-count">{result.cards.length}</span></button><button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}><span>Quiz</span><span className="tab-count">{result.quiz.length}</span></button></div>

          {activeTab === 'cards' ? <FlashcardDeck cards={result.cards} /> : <Quiz questions={result.quiz} />}
        </section>
      )}

      <footer><span>StudySpark AI</span><span>React + Gemini</span><span>Structured JSON</span><span>Validated server-side</span></footer>
    </main>
  )
}
