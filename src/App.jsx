import { useMemo, useState } from 'react'
import './App.css'

function generatePermutations(value) {
  const digits = value.split('')
  const used = new Array(digits.length).fill(false)
  const current = []
  const result = []

  function backtrack() {
    if (current.length === digits.length) {
      result.push(current.join(''))
      return
    }

    for (let i = 0; i < digits.length; i += 1) {
      if (used[i]) continue
      used[i] = true
      current.push(digits[i])
      backtrack()
      current.pop()
      used[i] = false
    }
  }

  backtrack()
  return result
}

function App() {
  const [code, setCode] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const isValid = /^\d{4}$/.test(code)

  const permutations = useMemo(
    () => (isValid ? generatePermutations(code) : []),
    [code, isValid],
  )

  async function handleCopy(value, key) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? '' : prev))
      }, 1200)
    } catch {
      setCopiedKey('')
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Neon Sequence Generator</p>
        <h1>Eclipse Safe Cracking</h1>
        <p className="subtitle">
          Enter a 4-digit code. The output lists every permutation using each
          digit index exactly once.
        </p>

        <label htmlFor="codeInput" className="label">
          4 Digit Code
        </label>
        <input
          id="codeInput"
          className="code-input"
          inputMode="numeric"
          maxLength={4}
          placeholder="0000"
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, '').slice(0, 4))
          }
        />
        <p className="helper">
          {isValid
            ? `Total permutations: ${permutations.length}`
            : 'Enter exactly 4 digits to generate permutations.'}
        </p>
      </section>

      <section className="results-card">
        <h2>Permutations</h2>
        {!isValid ? (
          <p className="empty">Waiting for a valid 4 digit code...</p>
        ) : (
          <ul className="results-grid">
            {permutations.map((item, index) => {
              const key = `${item}-${index}`
              const copied = copiedKey === key

              return (
                <li key={key} className="result-item">
                  <span className="result-value">{item}</span>
                  <button
                    type="button"
                    className={`copy-btn${copied ? ' copied' : ''}`}
                    onClick={() => handleCopy(item, key)}
                    aria-label={`Copy ${item}`}
                  >
                    {copied ? 'Copied ✓' : 'Copy'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App