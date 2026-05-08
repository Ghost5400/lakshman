import { useMemo, useState } from 'react'
import symptoms from '../../data/symptoms.json'

function toLabel(symptom) {
  return symptom
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function highlightMatch(label, query) {
  const lowerLabel = label.toLowerCase()
  const lowerQuery = query.trim().toLowerCase()

  if (!lowerQuery) {
    return label
  }

  const matchStart = lowerLabel.indexOf(lowerQuery)
  if (matchStart === -1) {
    return label
  }

  const matchEnd = matchStart + lowerQuery.length
  return (
    <>
      {label.slice(0, matchStart)}
      <strong className="text-primary">{label.slice(matchStart, matchEnd)}</strong>
      {label.slice(matchEnd)}
    </>
  )
}

function SymptomInput({ selectedSymptoms, onAddSymptom, onRemoveSymptom }) {
  const [query, setQuery] = useState('')

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return []

    return symptoms
      .filter((symptom) => !selectedSymptoms.includes(symptom))
      .filter((symptom) => symptom.includes(normalizedQuery))
      .slice(0, 5)
  }, [query, selectedSymptoms])

  const addSymptom = (symptom) => {
    onAddSymptom(symptom)
    setQuery('')
  }

  return (
    <section className="flex flex-col gap-md">
      <label htmlFor="symptom-search" className="text-h2 font-h2 text-on-surface">
        What are your symptoms?
      </label>

      <div className="relative">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-md text-primary">search</span>
          <input
            id="symptom-search"
            aria-label="Search symptoms"
            className="w-full pl-[48px] pr-[52px] py-md bg-surface-container-lowest text-on-surface text-body font-body rounded-full border-2 border-primary focus:outline-none shadow-sm transition-all placeholder:text-on-surface-variant"
            placeholder="Type a symptom (e.g. fever, headache...)"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            aria-label="Voice input not available offline"
            className="absolute right-md text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>

        {query.trim().length > 0 && suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(28,25,23,0.12)] overflow-hidden flex flex-col z-20">
            {suggestions.map((symptom) => {
              const label = toLabel(symptom)
              return (
                <button
                  key={symptom}
                  type="button"
                  className="flex items-center justify-between w-full px-md py-md hover:bg-surface-container-low transition-colors text-left border-b border-outline-variant last:border-0"
                  onClick={() => addSymptom(symptom)}
                >
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                      healing
                    </span>
                    <span className="text-body font-body text-on-surface">
                      {highlightMatch(label, query)}
                    </span>
                  </div>
                  <span className="text-primary text-small font-small font-medium">Add +</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-sm">
          {selectedSymptoms.map((symptom) => (
            <div
              key={symptom}
              className="flex items-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-full shadow-sm hover:bg-primary-fixed transition-colors"
            >
              <span className="text-body font-body font-medium">{toLabel(symptom)}</span>
              <button
                type="button"
                aria-label={`Remove ${toLabel(symptom)}`}
                className="text-on-primary-container hover:text-on-surface p-xs rounded-full flex items-center justify-center transition-colors"
                onClick={() => onRemoveSymptom(symptom)}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default SymptomInput
