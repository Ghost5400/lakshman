import diseases from '../data/diseases.json' with { type: 'json' }

export const EMERGENCY_SYMPTOMS = [
  'chest-pain',
  'unconsciousness',
  'seizure',
  'breathing-difficulty',
  'shortness-of-breath',
  'severe-bleeding',
]

const COMMON_FIRST_DISEASES = new Set([
  'influenza',
  'common-cold',
  'allergies',
  'strep-throat',
  'gastroenteritis',
])

const SEVERE_DISEASES = new Set(['pneumonia', 'copd', 'covid-19', 'asthma'])

function normalizeSymptoms(symptoms = []) {
  return symptoms
    .map((symptom) => String(symptom).trim().toLowerCase())
    .filter(Boolean)
}

export function checkEmergency(symptoms = []) {
  const normalized = normalizeSymptoms(symptoms)
  const hasDirectEmergency = normalized.some((symptom) => EMERGENCY_SYMPTOMS.includes(symptom))
  const hasChestAndBreathing =
    normalized.includes('chest-pain') &&
    (normalized.includes('breathing-difficulty') || normalized.includes('shortness-of-breath'))

  return hasDirectEmergency || hasChestAndBreathing
}

function mapSeverityScore(score = 0) {
  if (score >= 11) return 'emergency'
  if (score >= 8) return 'serious'
  if (score >= 4) return 'moderate'
  return 'mild'
}

function deriveSeverityScore(context = {}, matchedSymptoms = []) {
  const answers = context.answers ?? {}
  const durationDays = Number(answers.durationDays) || 0
  const painScale = Number(context.painScale ?? answers.painScale ?? 0)
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const feverIntensity = String(answers.feverIntensity ?? '')
  const symptomsWorsening = Boolean(answers.symptomsWorsening)
  const severeWeakness = Boolean(answers.severeWeakness)
  const severeBreathingIssue = Boolean(answers.severeBreathingIssue)
  const chestPainNow = Boolean(answers.chestPainNow)
  const activityTolerance = String(answers.activityTolerance ?? '')
  const highRiskMatchCount = matchedSymptoms.filter((symptom) =>
    ['chest-pain', 'shortness-of-breath', 'breathing-difficulty', 'unconsciousness', 'seizure'].includes(
      symptom,
    ),
  ).length

  let score = 0
  if (durationDays >= 7) score += 2
  else if (durationDays >= 3) score += 1
  if (painScale >= 8) score += 3
  else if (painScale >= 5) score += 2
  else if (painScale >= 3) score += 1
  if (breathingLevel >= 8) score += 3
  else if (breathingLevel >= 5) score += 2
  if (feverIntensity === 'high') score += 2
  if (symptomsWorsening) score += 2
  if (activityTolerance === 'unable') score += 2
  else if (activityTolerance === 'limited') score += 1
  if (severeWeakness) score += 1
  if (severeBreathingIssue) score += 3
  if (chestPainNow) score += 2
  score += Math.min(highRiskMatchCount, 3)

  return score
}

function toEvidence(result, inputSymptoms = []) {
  const overlap = result.matched ?? []
  const overlapLabels = overlap.slice(0, 3).join(', ')
  const overlapRatio = inputSymptoms.length > 0 ? overlap.length / inputSymptoms.length : 0
  const strength = overlapRatio >= 0.7 ? 'Strong' : overlapRatio >= 0.4 ? 'Moderate' : 'Early'

  return {
    strength,
    reason:
      overlap.length > 0
        ? `Matched symptom pattern: ${overlapLabels}${overlap.length > 3 ? ', ...' : ''}`
        : 'Limited overlap with the current symptom pattern.',
  }
}

export function scoreDisease(inputSymptoms = [], disease) {
  const normalizedInput = normalizeSymptoms(inputSymptoms)
  const matched = []
  let weightedScore = 0

  for (const symptom of normalizedInput) {
    const weight = disease?.weights?.[symptom]
    if (weight) {
      weightedScore += weight
      matched.push(symptom)
    }
  }

  const totalDiseaseSymptoms = disease?.symptoms?.length || 1
  const coverageRatio = matched.length / totalDiseaseSymptoms

  return {
    score: Number((weightedScore * coverageRatio).toFixed(2)),
    matched,
  }
}

function getEscalationEvidence(context = {}, normalizedInput = []) {
  const answers = context.answers ?? {}
  const durationDays = Number(answers.durationDays) || 0
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const feverIntensity = String(answers.feverIntensity ?? '')
  const symptomsWorsening = Boolean(answers.symptomsWorsening)
  const chestPainNow = Boolean(answers.chestPainNow)
  const severeBreathingIssue = Boolean(answers.severeBreathingIssue)
  const activityTolerance = String(answers.activityTolerance ?? '')
  const mucusPresent = Boolean(answers.mucusPresent)
  const coughType = String(answers.coughType ?? '')

  const strongIndicators = [
    chestPainNow,
    severeBreathingIssue,
    breathingLevel >= 7,
    durationDays >= 7 && symptomsWorsening,
    feverIntensity === 'high' && durationDays >= 4,
    activityTolerance === 'unable',
    normalizedInput.includes('shortness-of-breath'),
    normalizedInput.includes('breathing-difficulty'),
  ].filter(Boolean).length

  return {
    strongIndicators,
    durationDays,
    breathingLevel,
    feverIntensity,
    symptomsWorsening,
    chestPainNow,
    severeBreathingIssue,
    activityTolerance,
    mucusPresent,
    coughType,
  }
}

function adjustDiseaseScore(disease, baseScore, context = {}, normalizedInput = []) {
  const evidence = getEscalationEvidence(context, normalizedInput)
  let score = baseScore

  if (COMMON_FIRST_DISEASES.has(disease.id)) {
    score *= 1.25
    if (evidence.durationDays <= 3) score *= 1.1
    if (!evidence.symptomsWorsening) score *= 1.08
  }

  if (SEVERE_DISEASES.has(disease.id)) {
    score *= 0.62
    if (evidence.strongIndicators >= 2) score *= 1.35
    if (evidence.strongIndicators >= 4) score *= 1.25
    if (evidence.durationDays <= 2) score *= 0.75
    if (evidence.feverIntensity === 'high' && evidence.durationDays >= 4) score *= 1.25
    if (evidence.breathingLevel >= 7 || evidence.severeBreathingIssue) score *= 1.4
    if (disease.id === 'pneumonia' && evidence.coughType === 'wet' && evidence.mucusPresent) score *= 1.3
  }

  return Number(score.toFixed(2))
}

function buildAssessmentMessage(results = [], globalSeverity = 'mild') {
  const top = results[0]
  if (!top) {
    return 'Your symptoms look mild at this stage. Continue rest, hydration, and monitor for any worsening signs.'
  }

  if (globalSeverity === 'mild' || globalSeverity === 'moderate') {
    return 'Your symptoms currently appear more consistent with a mild viral illness or other common, self-limiting condition.'
  }

  if (SEVERE_DISEASES.has(top.id)) {
    return 'Some concerning patterns were noted, but this is not a confirmed diagnosis. Please monitor closely and seek medical advice if symptoms worsen.'
  }

  return 'Your symptoms need closer monitoring. Follow care guidance and seek medical support if recovery does not begin soon.'
}

export function runMatcher(inputSymptoms = [], context = {}) {
  const normalizedInput = normalizeSymptoms(inputSymptoms)
  const answers = context?.answers ?? {}
  const emergencyFromAnswers = Boolean(
    answers.faintingEpisode ||
      answers.severeBleeding ||
      answers.severeBreathingIssue ||
      answers.blueLips ||
      answers.confusionNow ||
      answers.coughingBlood ||
      (answers.chestPainNow && answers.breathingDifficultyLevel >= 7),
  )

  if (checkEmergency(normalizedInput) || emergencyFromAnswers) {
    return { emergency: true, results: [], assessmentMessage: '' }
  }

  const scored = diseases
    .map((disease) => {
      const { score: baseScore, matched } = scoreDisease(normalizedInput, disease)
      const adjustedScore = adjustDiseaseScore(disease, baseScore, context, normalizedInput)
      return { ...disease, score: adjustedScore, matched }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const maxScore = scored[0]?.score || 1
  const severityScore = deriveSeverityScore(context, normalizedInput)
  const globalSeverity = mapSeverityScore(severityScore)
  const escalationEvidence = getEscalationEvidence(context, normalizedInput)
  const results = scored.slice(0, 3).map((entry) => {
    let confidence = Math.min(94, Math.max(28, Math.round((entry.score / maxScore) * 100)))
    if (SEVERE_DISEASES.has(entry.id) && escalationEvidence.strongIndicators < 2) {
      confidence = Math.min(confidence, 48)
    }
    if (COMMON_FIRST_DISEASES.has(entry.id) && globalSeverity !== 'serious' && globalSeverity !== 'emergency') {
      confidence = Math.max(confidence, 55)
    }

    return {
      ...entry,
      confidence,
      evidence: toEvidence(entry, normalizedInput),
      globalSeverity,
    }
  })

  return {
    emergency: false,
    results,
    globalSeverity,
    assessmentMessage: buildAssessmentMessage(results, globalSeverity),
  }
}
