import { useMemo, useState } from 'react'
import EmergencyModal from '../components/symptom/EmergencyModal'
import ResultCard from '../components/symptom/ResultCard'
import SymptomInput from '../components/symptom/SymptomInput'
import { runMatcher } from '../engine/matcher'

const QUICK_SYMPTOMS = ['fever', 'cough', 'headache']

function toLabel(symptom) {
  return symptom
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function Home() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [results, setResults] = useState([])
  const [showEmergency, setShowEmergency] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const addSymptom = (symptom) => {
    setSelectedSymptoms((current) => (current.includes(symptom) ? current : [...current, symptom]))
  }

  const removeSymptom = (symptom) => {
    setSelectedSymptoms((current) => current.filter((item) => item !== symptom))
  }

  const clearAll = () => {
    setSelectedSymptoms([])
    setResults([])
    setHasChecked(false)
    setShowEmergency(false)
  }

  const runAssessment = () => {
    if (selectedSymptoms.length === 0) return

    const match = runMatcher(selectedSymptoms)
    setHasChecked(true)
    setResults(match.results)
    setShowEmergency(match.emergency)
  }

  const canCheck = selectedSymptoms.length > 0
  const isEmptyState = selectedSymptoms.length === 0 && !hasChecked
  const showNoResultsState = hasChecked && !showEmergency && results.length === 0
  const sortedQuickSymptoms = useMemo(
    () => QUICK_SYMPTOMS.filter((symptom) => !selectedSymptoms.includes(symptom)),
    [selectedSymptoms],
  )

  return (
    <>
      <section className="flex flex-col gap-lg">
        <SymptomInput
          selectedSymptoms={selectedSymptoms}
          onAddSymptom={addSymptom}
          onRemoveSymptom={removeSymptom}
        />

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="text-small font-small text-primary underline underline-offset-4 disabled:text-on-surface-variant disabled:no-underline"
            disabled={!canCheck && !hasChecked}
            onClick={clearAll}
          >
            Clear All
          </button>
        </div>

        {isEmptyState && (
          <div className="flex-grow flex flex-col items-center justify-center text-center px-lg">
            <div className="w-48 h-48 mb-lg relative flex items-center justify-center opacity-80">
              <svg
                className="w-full h-full absolute animate-[pulse_4s_ease-in-out_infinite]"
                viewBox="0 0 200 200"
              >
                <path
                  d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.6,96.9,-16.8,95.7,-0.7C94.5,15.4,86,30.7,76.2,44.5C66.4,58.3,55.2,70.7,41.8,78.8C28.3,86.9,14.2,90.8,-0.2,91.2C-14.6,91.6,-29.2,88.5,-43.4,81.2C-57.7,73.8,-71.6,62.1,-79.2,47.5C-86.8,32.9,-88.2,15.5,-86.8,-1.1C-85.3,-17.8,-81,-35.6,-72.2,-50C-63.5,-64.4,-50.4,-75.4,-36.3,-82.1C-22.2,-88.8,-7.1,-91.2,7.8,-88.9C22.8,-86.6,45.5,-83.6,44.7,-76.4Z"
                  fill="#e4e9e7"
                  transform="translate(100 100)"
                />
              </svg>
              <svg className="w-40 h-40 absolute" viewBox="0 0 200 200">
                <path
                  d="M39.9,-65.7C52.8,-60.5,65.2,-53,74.1,-41.7C83,-30.4,88.4,-15.2,86.6,-1.1C84.8,13,75.8,26.1,67.4,39.8C59,53.5,51.2,67.9,39.8,75.5C28.4,83.1,14.2,83.9,-0.5,84.8C-15.1,85.7,-30.3,86.6,-43.8,80.6C-57.4,74.6,-69.4,61.7,-76.8,47.1C-84.2,32.5,-86.9,16.2,-86.8,0.1C-86.7,-16,-83.7,-32,-76.4,-45.6C-69,-59.2,-57.4,-70.4,-43.7,-75.3C-30.1,-80.3,-15,-79,-0.9,-77.5C13.3,-76.1,27,-70.8,39.9,-65.7Z"
                  fill="#f0f5f2"
                  transform="translate(100 100)"
                />
              </svg>
              <div className="relative z-10 bg-surface-container-lowest p-xl rounded-full shadow-sm border border-outline-variant/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-primary">
                  health_and_safety
                </span>
              </div>
            </div>

            <p className="text-body font-body text-on-surface-variant italic max-w-xs leading-relaxed">
              Add your symptoms above to get started
            </p>

            <div className="mt-lg flex gap-sm flex-wrap justify-center">
              {sortedQuickSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  className="bg-surface-container text-on-surface-variant px-md py-xs rounded-full text-small font-small border border-outline-variant/50 hover:bg-surface-container-highest transition-colors"
                  onClick={() => addSymptom(symptom)}
                >
                  {toLabel(symptom)}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && !showEmergency && (
          <section className="flex flex-col gap-md">
            <h2 className="text-h1 font-h1 text-on-surface">Analysis Results</h2>
            {results.map((result, index) => (
              <ResultCard key={result.id} result={result} isTopResult={index === 0} />
            ))}

            <div className="pt-sm">
              <button
                type="button"
                className="bg-surface-container text-primary font-h3 text-h3 px-lg py-md rounded-full shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-sm border border-outline-variant"
                onClick={clearAll}
              >
                <span className="material-symbols-outlined">restart_alt</span>
                Start New Assessment
              </button>
            </div>
          </section>
        )}

        {showNoResultsState && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-md shadow-sm">
            <h2 className="text-h2 font-h2 text-on-surface">No close match found</h2>
            <p className="text-body font-body text-on-surface-variant mt-xs">
              Try adding more symptoms for better confidence.
            </p>
          </section>
        )}

        <section className="mt-auto pt-lg pb-margin sticky bottom-0 md:static bg-gradient-to-t from-background via-background to-transparent md:bg-none z-0">
          <button
            type="button"
            disabled={!canCheck}
            className={`w-full h-[56px] text-h3 font-h3 rounded-full flex items-center justify-center gap-sm transition-all ${
              canCheck
                ? 'bg-primary text-on-primary shadow-[0px_4px_12px_rgba(0,104,95,0.2)] hover:shadow-[0px_8px_24px_rgba(0,104,95,0.3)] active:scale-[0.98]'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
            }`}
            onClick={runAssessment}
          >
            <span>Check Symptoms</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </section>
      </section>

      {showEmergency && <EmergencyModal onDismiss={() => setShowEmergency(false)} />}
    </>
  )
}

export default Home
