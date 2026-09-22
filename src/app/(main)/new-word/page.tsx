'use client'

import React, { useEffect, useState, useSyncExternalStore } from 'react'

type SavedWord = {
  id: string
  word: string
  partOfSpeech: string
  meaning: string
  example: string
  createdAt: string
}

const STORAGE_KEY = 'vocab-up:words'
const WORDS_EVENT = 'vocab-up:words:change'
const EMPTY_WORDS: SavedWord[] = []

const partsOfSpeech = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection', 'Phrase']

/* ── localStorage-backed store ─────────────────────────────── */

let cachedWords: SavedWord[] | null = null

function loadWords(): SavedWord[] {
  if (cachedWords !== null) return cachedWords
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    cachedWords = raw ? (JSON.parse(raw) as SavedWord[]) : []
  } catch {
    cachedWords = []
  }
  return cachedWords
}

function saveWords(words: SavedWord[]) {
  cachedWords = words
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  window.dispatchEvent(new Event(WORDS_EVENT))
}

function subscribeWords(onStoreChange: () => void) {
  window.addEventListener(WORDS_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    window.removeEventListener(WORDS_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

/* ── Component ─────────────────────────────────────────────── */

const NewWord = () => {
  const savedWords = useSyncExternalStore(subscribeWords, loadWords, () => EMPTY_WORDS)

  const [word, setWord] = useState('')
  const [partOfSpeech, setPartOfSpeech] = useState('Noun')
  const [example, setExample] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 3000)
    return () => clearTimeout(timer)
  }, [success])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedWord = word.trim()

    if (!trimmedWord) {
      setError('The word is required.')
      setSuccess(null)
      return
    }

    if (savedWords.some(w => w.word.toLowerCase() === trimmedWord.toLowerCase())) {
      setError(`"${trimmedWord}" is already saved.`)
      setSuccess(null)
      return
    }

    saveWords([
      {
        id: crypto.randomUUID(),
        word: trimmedWord,
        partOfSpeech,
        meaning: '',
        example: example.trim(),
        createdAt: new Date().toISOString(),
      },
      ...savedWords,
    ])

    setWord('')
    setExample('')
    setError(null)
    setSuccess(`"${trimmedWord}" was added to your vocabulary.`)
  }

  const handleDelete = (id: string) => {
    saveWords(savedWords.filter(w => w.id !== id))
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Head */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">New Word</h1>
        <p className="text-sm text-muted-foreground">Add a word you discovered today to your vocabulary.</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="word" className="text-sm font-medium text-foreground">Word</label>
            <input
              id="word"
              type="text"
              value={word}
              onChange={e => setWord(e.target.value)}
              placeholder="e.g. Ephemeral"
              className="bg-card border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="partOfSpeech" className="text-sm font-medium text-foreground">Part of speech</label>
            <select
              id="partOfSpeech"
              value={partOfSpeech}
              onChange={e => setPartOfSpeech(e.target.value)}
              className="bg-card border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {partsOfSpeech.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="example" className="text-sm font-medium text-foreground">Example sentence <span className="text-muted-foreground font-normal">(optional)</span></label>
          <textarea
            id="example"
            value={example}
            onChange={e => setExample(e.target.value)}
            placeholder="Use the word in a sentence..."
            rows={2}
            className="bg-card border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-primary text-primary-foreground py-2 px-5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Add Word
          </button>
          {success && (
            <p className="text-sm text-success">{success}</p>
          )}
        </div>
      </form>

      {/* Saved words */}
      <section className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">Saved Words</h2>

        {savedWords.length === 0 ? (
          <p className="text-sm text-muted-foreground">No words saved yet. Add your first word above.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {savedWords.map(item => (
              <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{item.word}</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{item.partOfSpeech}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.meaning || 'Meaning coming soon'}
                  </span>
                  {item.example && (
                    <span className="text-sm text-muted-foreground italic">&ldquo;{item.example}&rdquo;</span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Delete ${item.word}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default NewWord