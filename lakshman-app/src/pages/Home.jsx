import { useEffect, useMemo, useState } from 'react'
import ResultCard from '../components/symptom/ResultCard'
import SymptomInput from '../components/symptom/SymptomInput'
import { runMatcher } from '../engine/matcher'

const STEP = {
  INTRO: 0,
  SYMPTOMS: 1,
  REGION: 2,
  QUESTIONS: 3,
  SEVERITY: 4,
  ANALYSIS: 5,
  RESULTS: 6,
  RECOVERY: 7,
  EMERGENCY: 8,
}

const BODY_REGIONS = [
  { id: 'head', label: 'Head', icon: 'face' },
  { id: 'throat', label: 'Throat', icon: 'record_voice_over' },
  { id: 'chest', label: 'Chest', icon: 'cardiology' },
  { id: 'abdomen', label: 'Abdomen', icon: 'pill' },
  { id: 'arms', label: 'Arms', icon: 'accessibility_new' },
  { id: 'legs', label: 'Legs', icon: 'directions_walk' },
  { id: 'skin', label: 'Skin', icon: 'dermatology' },
]

const REGION_SYMPTOM_HINTS = {
  head: ['headache', 'dizziness', 'blurred-vision', 'loss-of-smell', 'loss-of-taste'],
  throat: ['sore-throat', 'cough', 'runny-nose', 'sneezing', 'nasal-congestion'],
  chest: ['chest-pain', 'chest-tightness', 'shortness-of-breath', 'breathing-difficulty', 'wheezing'],
  abdomen: ['abdominal-pain', 'nausea', 'vomiting', 'diarrhea', 'dehydration'],
  arms: ['joint-pain', 'swelling', 'body-ache'],
  legs: ['joint-pain', 'swelling', 'fatigue'],
  skin: ['skin-rash', 'itching', 'red-skin-patch'],
}

function toLabel(value) {
  return String(value)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildQuestions(selectedSymptoms = [], region = '') {
  const includes = (symptom) => selectedSymptoms.includes(symptom)
  const questions = [
    {
      id: 'durationDays',
      prompt: 'How long have these symptoms been present?',
      options: [
        { label: 'Less than 24 hours', value: 1 },
        { label: '1-3 days', value: 3 },
        { label: '4-7 days', value: 7 },
        { label: 'More than 1 week', value: 10 },
      ],
    },
  ]

  if (includes('fever')) {
    questions.push({
      id: 'feverIntensity',
      prompt: 'How intense is the fever right now?',
      options: [
        { label: 'Mild / low-grade', value: 'mild' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'High fever', value: 'high' },
      ],
    })
  }

  if (includes('cough')) {
    questions.push({
      id: 'coughType',
      prompt: 'How would you describe the cough?',
      options: [
        { label: 'Mostly dry cough', value: 'dry' },
        { label: 'Wet cough with mucus', value: 'wet' },
        { label: 'Not sure', value: 'unknown' },
      ],
    })
    questions.push({
      id: 'mucusPresent',
      prompt: 'Are you coughing up mucus/phlegm?',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    })
  }

  if (includes('fever') || includes('cough') || includes('sore-throat')) {
    questions.push({
      id: 'bodyPainLevel',
      prompt: 'How strong are body aches or muscle pain?',
      options: [
        { label: 'None', value: 0 },
        { label: 'Mild', value: 1 },
        { label: 'Moderate', value: 2 },
        { label: 'Severe', value: 3 },
      ],
    })
    questions.push({
      id: 'soreThroatNow',
      prompt: 'Do you currently have a sore or irritated throat?',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    })
    questions.push({
      id: 'fatigueLevel',
      prompt: 'How much fatigue are you feeling?',
      options: [
        { label: 'Low', value: 1 },
        { label: 'Moderate', value: 2 },
        { label: 'High', value: 3 },
      ],
    })
  }

  if (includes('chest-pain') || includes('shortness-of-breath') || region === 'chest') {
    questions.push({
      id: 'breathingDifficultyLevel',
      prompt: 'How difficult is breathing right now?',
      options: [
        { label: 'Mild', value: 3 },
        { label: 'Moderate', value: 6 },
        { label: 'Severe', value: 9 },
      ],
    })
  }

  questions.push({
    id: 'symptomsWorsening',
    prompt: 'Are your symptoms getting worse compared to yesterday?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'activityTolerance',
    prompt: 'Can you do your usual daily activities?',
    options: [
      { label: 'Yes, mostly normal', value: 'normal' },
      { label: 'Partly limited', value: 'limited' },
      { label: 'No, very difficult', value: 'unable' },
    ],
  })

  questions.push({
    id: 'dizzinessNow',
    prompt: 'Any dizziness or lightheaded feeling?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'chestTightnessNow',
    prompt: 'Any chest tightness right now?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'severeWeakness',
    prompt: 'Are you feeling unusual weakness or unable to stay active?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'chestPainNow',
    prompt: 'Emergency check: Any chest pain right now?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'severeBreathingIssue',
    prompt: 'Emergency check: Is breathing severely difficult even at rest?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'blueLips',
    prompt: 'Emergency check: Any blue/gray lips or fingertips?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'confusionNow',
    prompt: 'Emergency check: Any sudden confusion or disorientation?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'coughingBlood',
    prompt: 'Emergency check: Are you coughing up blood?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  questions.push({
    id: 'faintingEpisode',
    prompt: 'Any fainting, unconsciousness, or seizure-like episode?',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  })

  return questions
}

function Home() {
  const [step, setStep] = useState(STEP.INTRO)
  const [personType, setPersonType] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('')
  const [answers, setAnswers] = useState({})
  const [questionIndex, setQuestionIndex] = useState(0)
  const [painScale, setPainScale] = useState(0)
  const [, setResults] = useState([])
  const [primaryResult, setPrimaryResult] = useState(null)
  const [secondaryResults, setSecondaryResults] = useState([])
  const [, setShowEmergency] = useState(false)
  const [globalSeverity, setGlobalSeverity] = useState('mild')
  const [severityLabel, setSeverityLabel] = useState('Mild')
  const [assessmentMessage, setAssessmentMessage] = useState('')
  const [primaryReason, setPrimaryReason] = useState('')
  const [seekHelpIf, setSeekHelpIf] = useState([])

  const clearAll = () => {
    setStep(STEP.INTRO)
    setPersonType('')
    setSelectedSymptoms([])
    setSelectedRegion('')
    setAnswers({})
    setQuestionIndex(0)
    setPainScale(0)
    setResults([])
    setPrimaryResult(null)
    setSecondaryResults([])
    setShowEmergency(false)
    setGlobalSeverity('mild')
    setSeverityLabel('Mild')
    setAssessmentMessage('')
    setPrimaryReason('')
    setSeekHelpIf([])
  }

  const questions = useMemo(() => buildQuestions(selectedSymptoms, selectedRegion), [
    selectedSymptoms,
    selectedRegion,
  ])
  const currentQuestion = questions[questionIndex]
  const filteredRegionSymptoms = useMemo(() => {
    if (!selectedRegion) return []
    const hints = REGION_SYMPTOM_HINTS[selectedRegion] ?? []
    return selectedSymptoms.filter((symptom) => hints.includes(symptom))
  }, [selectedRegion, selectedSymptoms])

  const finalizeAssessment = () => {
    const match = runMatcher(selectedSymptoms, {
      answers,
      painScale,
      selectedRegion,
      personType,
    })
    setResults(match.results)
    setPrimaryResult(match.primaryResult ?? null)
    setSecondaryResults(match.secondaryResults ?? [])
    setShowEmergency(match.emergency)
    setGlobalSeverity(match.globalSeverity ?? 'mild')
    setSeverityLabel(match.severityLabel ?? 'Mild')
    setAssessmentMessage(match.assessmentMessage ?? '')
    setPrimaryReason(match.primaryReason ?? '')
    setSeekHelpIf(match.seekHelpIf ?? [])
    setStep(match.emergency ? STEP.EMERGENCY : STEP.RESULTS)
  }

  useEffect(() => {
    if (step !== STEP.ANALYSIS) return

    const timeout = setTimeout(() => {
      finalizeAssessment()
    }, 1500)

    return () => clearTimeout(timeout)
  }, [step])

  const addSymptom = (symptom) => {
    setSelectedSymptoms((current) => (current.includes(symptom) ? current : [...current, symptom]))
  }

  const removeSymptom = (symptom) => {
    setSelectedSymptoms((current) => current.filter((item) => item !== symptom))
  }

  const submitAnswer = (value) => {
    if (!currentQuestion) return
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))
    if (questionIndex >= questions.length - 1) {
      setStep(STEP.SEVERITY)
      return
    }
    setQuestionIndex((current) => current + 1)
  }

  const progressPercent = Math.round(((questionIndex + 1) / Math.max(questions.length, 1)) * 100)

  return (
    <section className="flex flex-col gap-lg">
      {step === STEP.INTRO && (
        <article className="rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm p-lg text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-md">
            <span className="material-symbols-outlined text-[30px]">health_and_safety</span>
          </div>
          <h2 className="text-h1 font-h1 text-on-surface">Guided Health Assessment</h2>
          <p className="text-body font-body text-on-surface-variant mt-sm">
            We will ask a few medical follow-up questions before suggesting possible conditions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-lg">
            <button
              type="button"
              className="rounded-xl border border-outline-variant bg-surface-container-low p-md text-left hover:border-primary transition-colors"
              onClick={() => {
                setPersonType('myself')
                setStep(STEP.SYMPTOMS)
              }}
            >
              <span className="text-h3 font-h3 text-on-surface">Myself</span>
            </button>
            <button
              type="button"
              className="rounded-xl border border-outline-variant bg-surface-container-low p-md text-left hover:border-primary transition-colors"
              onClick={() => {
                setPersonType('someone-else')
                setStep(STEP.SYMPTOMS)
              }}
            >
              <span className="text-h3 font-h3 text-on-surface">Someone Else</span>
            </button>
          </div>
        </article>
      )}

      {step === STEP.SYMPTOMS && (
        <>
          <SymptomInput
            selectedSymptoms={selectedSymptoms}
            onAddSymptom={addSymptom}
            onRemoveSymptom={removeSymptom}
          />
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-primary text-on-primary text-h3 font-h3 disabled:bg-surface-container disabled:text-on-surface-variant"
            disabled={selectedSymptoms.length === 0}
            onClick={() => setStep(STEP.REGION)}
          >
            Continue to Body Region
          </button>
        </>
      )}

      {step === STEP.REGION && (
        <>
          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h3 className="text-h2 font-h2 text-on-surface mb-sm">Select symptom location</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
              {BODY_REGIONS.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  className={`rounded-xl border p-sm text-left transition-colors ${
                    selectedRegion === region.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-container-low border-outline-variant text-on-surface'
                  }`}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  <span className="material-symbols-outlined text-[20px]">{region.icon}</span>
                  <p className="text-small font-small mt-xs">{region.label}</p>
                </button>
              ))}
            </div>
            <div className="mt-md">
              <p className="text-small font-small text-on-surface-variant">
                Region related symptoms: {filteredRegionSymptoms.length > 0 ? '' : 'None selected yet'}
              </p>
              <div className="flex flex-wrap gap-sm mt-xs">
                {filteredRegionSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="px-sm py-xs rounded-full text-small font-small bg-primary/10 text-primary"
                  >
                    {toLabel(symptom)}
                  </span>
                ))}
              </div>
            </div>
          </article>
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-primary text-on-primary text-h3 font-h3 disabled:bg-surface-container disabled:text-on-surface-variant"
            disabled={!selectedRegion}
            onClick={() => setStep(STEP.QUESTIONS)}
          >
            Continue to Questions
          </button>
        </>
      )}

      {step === STEP.QUESTIONS && currentQuestion && (
        <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
          <div className="w-full bg-surface-dim rounded-full h-2 mb-md">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
          </div>
          <h3 className="text-h2 font-h2 text-on-surface">{currentQuestion.prompt}</h3>
          <p className="text-small font-small text-on-surface-variant mt-xs">
            Question {questionIndex + 1} of {questions.length}
          </p>
          <div className="grid grid-cols-1 gap-sm mt-md">
            {currentQuestion.options.map((option) => (
              <button
                key={`${currentQuestion.id}-${String(option.value)}`}
                type="button"
                className="rounded-xl border border-outline-variant bg-surface-container-low p-md text-left hover:border-primary transition-colors"
                onClick={() => submitAnswer(option.value)}
              >
                <span className="text-body font-body text-on-surface">{option.label}</span>
              </button>
            ))}
          </div>
        </article>
      )}

      {step === STEP.SEVERITY && (
        <>
          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h3 className="text-h2 font-h2 text-on-surface">How intense is the discomfort right now?</h3>
            <p className="text-small font-small text-on-surface-variant mt-xs">
              Choose from 1 (mild) to 10 (very severe).
            </p>
            <div className="grid grid-cols-5 gap-sm mt-md">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`h-11 rounded-lg border text-small font-small ${
                    painScale === value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low border-outline-variant text-on-surface'
                  }`}
                  onClick={() => setPainScale(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </article>
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-primary text-on-primary text-h3 font-h3 disabled:bg-surface-container disabled:text-on-surface-variant"
            disabled={painScale < 1}
            onClick={() => setStep(STEP.ANALYSIS)}
          >
            Start Analysis
          </button>
        </>
      )}

      {step === STEP.ANALYSIS && (
        <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-lg text-center">
          <div className="mx-auto w-14 h-14 rounded-full border-4 border-surface-dim border-t-primary animate-spin" />
          <h3 className="text-h2 font-h2 text-on-surface mt-md">Analyzing symptom patterns...</h3>
          <p className="text-small font-small text-on-surface-variant mt-xs">
            Evaluating severity indicators and preparing guidance.
          </p>
        </article>
      )}

      {step === STEP.RESULTS && (
        <>
          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h2 className="text-h1 font-h1 text-on-surface">Assessment Result</h2>
            <p className="text-body font-body text-on-surface-variant mt-xs">
              {assessmentMessage || 'Based on your answers, symptoms currently match the following patterns.'}
            </p>
            <p className="text-small font-small mt-sm text-primary">
              Overall severity signal: {toLabel(globalSeverity)}
            </p>
          </article>
          {primaryResult && (
            <article className="rounded-xl bg-surface-container-lowest border border-primary/40 p-md shadow-sm">
              <p className="text-micro font-micro uppercase tracking-wider text-primary">Most Likely Condition</p>
              <div className="mt-xs">
                <ResultCard result={primaryResult} isTopResult />
              </div>
              {primaryReason && (
                <div className="mt-md rounded-lg border border-outline-variant bg-surface-container-low p-sm">
                  <p className="text-small font-small text-on-surface">
                    <span className="text-on-surface-variant">Why this result:</span> {primaryReason}
                  </p>
                </div>
              )}
            </article>
          )}

          {secondaryResults.length > 0 && (
            <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
              <h3 className="text-h2 font-h2 text-on-surface">Other Possible Conditions</h3>
              <ul className="mt-sm space-y-xs text-body font-body text-on-surface">
                {secondaryResults.map((result) => (
                  <li key={result.id}>
                    - {result.name} ({result.confidence}%)
                  </li>
                ))}
              </ul>
            </article>
          )}

          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h3 className="text-h2 font-h2 text-on-surface">Severity</h3>
            <p className="text-body font-body text-on-surface-variant mt-xs">{severityLabel}</p>
          </article>

          {primaryResult?.precautions?.length > 0 && (
            <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
              <h3 className="text-h2 font-h2 text-on-surface">Recommended Care</h3>
              <ul className="mt-sm space-y-xs text-body font-body text-on-surface-variant">
                {primaryResult.precautions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          )}

          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h3 className="text-h2 font-h2 text-on-surface">Seek Medical Help If</h3>
            <ul className="mt-sm space-y-xs text-body font-body text-on-surface-variant">
              {seekHelpIf.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-surface-container text-primary border border-outline-variant text-h3 font-h3"
            onClick={() => setStep(STEP.RECOVERY)}
          >
            View Care Guidance
          </button>
        </>
      )}

      {step === STEP.RECOVERY && (
        <>
          <article className="rounded-xl bg-surface-container-lowest border border-outline-variant p-md">
            <h3 className="text-h2 font-h2 text-on-surface">Care & Recovery Guidance</h3>
            <ul className="mt-sm space-y-xs text-body font-body text-on-surface-variant">
              <li>- Stay hydrated with water or oral rehydration solution.</li>
              <li>- Take adequate rest and avoid heavy activity for 24-48 hours.</li>
              <li>- Monitor warning signs like worsening breathing, persistent high fever, or confusion.</li>
              <li>- Seek medical care early if symptoms worsen or do not improve.</li>
            </ul>
          </article>
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-primary text-on-primary text-h3 font-h3"
            onClick={clearAll}
          >
            Start New Assessment
          </button>
        </>
      )}

      {step === STEP.EMERGENCY && (
        <>
          <article className="rounded-xl bg-error-container border border-error/30 p-md">
            <h3 className="text-h2 font-h2 text-on-error-container">Emergency Support Needed</h3>
            <p className="text-body font-body text-on-error-container mt-xs">
              Some severe indicators were detected. Please seek urgent medical support now.
            </p>
            <div className="mt-md space-y-xs text-small font-small text-on-error-container">
              <p>- Call local emergency services immediately.</p>
              <p>- Keep the person seated upright and calm.</p>
              <p>- Do not delay care while waiting for symptoms to improve.</p>
            </div>
          </article>
          <button
            type="button"
            className="w-full h-[56px] rounded-full bg-primary text-on-primary text-h3 font-h3"
            onClick={clearAll}
          >
            Start New Assessment
          </button>
        </>
      )}

      {step > STEP.INTRO && (
        <button
          type="button"
          className="text-small font-small text-primary underline underline-offset-4 self-end"
          onClick={clearAll}
        >
          Reset Assessment
        </button>
      )}
    </section>
  )
}

export default Home
