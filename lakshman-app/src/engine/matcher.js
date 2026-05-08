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

function explainSeverity(globalSeverity = 'mild') {
  if (globalSeverity === 'emergency') return 'Emergency'
  if (globalSeverity === 'serious') return 'Serious'
  if (globalSeverity === 'moderate') return 'Moderate'
  return 'Mild'
}

function getConditionContextBoost(disease, context = {}, normalizedInput = []) {
  const answers = context.answers ?? {}
  const durationDays = Number(answers.durationDays) || 0
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const feverIntensity = String(answers.feverIntensity ?? '')
  const symptomsWorsening = Boolean(answers.symptomsWorsening)
  const bodyPainLevel = Number(answers.bodyPainLevel) || 0
  const fatigueLevel = Number(answers.fatigueLevel) || 0
  const activityTolerance = String(answers.activityTolerance ?? '')
  const coughType = String(answers.coughType ?? '')
  const mucusPresent = Boolean(answers.mucusPresent)
  const chestTightnessNow = Boolean(answers.chestTightnessNow)
  const chestPainNow = Boolean(answers.chestPainNow)
  const soreThroatNow = Boolean(answers.soreThroatNow)
  const selectedRegion = String(context.selectedRegion ?? '')

  let bonus = 0
  const includes = (symptom) => normalizedInput.includes(symptom)

  if (disease.id === 'influenza') {
    if (includes('fever') && includes('body-ache')) bonus += 1.6
    if (fatigueLevel >= 2) bonus += 0.9
    if (bodyPainLevel >= 2) bonus += 1
    if (coughType === 'dry') bonus += 0.7
    if (durationDays >= 1 && durationDays <= 4) bonus += 0.7
    if (breathingLevel <= 4 && !chestPainNow) bonus += 0.4
  }

  if (disease.id === 'common-cold') {
    if (includes('runny-nose') || includes('sneezing')) bonus += 1.4
    if (soreThroatNow) bonus += 0.8
    if (feverIntensity === 'high') bonus -= 1.1
    if (durationDays <= 4) bonus += 0.5
  }

  if (disease.id === 'pneumonia') {
    if (coughType === 'wet' && mucusPresent) bonus += 1.6
    if (breathingLevel >= 6) bonus += 1.8
    if (durationDays >= 6 && symptomsWorsening) bonus += 1.5
    if (feverIntensity === 'high') bonus += 1.1
    if (breathingLevel <= 3 && durationDays <= 3) bonus -= 1.2
  }

  if (disease.id === 'covid-19') {
    if (includes('loss-of-smell') || includes('loss-of-taste')) bonus += 2
    if (durationDays >= 3) bonus += 0.6
    if (breathingLevel >= 5) bonus += 0.8
  }

  if (disease.id === 'asthma') {
    if (includes('wheezing') || chestTightnessNow) bonus += 1.5
    if (breathingLevel >= 6) bonus += 1.4
    if (feverIntensity === 'high') bonus -= 0.8
  }

  if (disease.id === 'gastroenteritis') {
    if (includes('diarrhea') && includes('vomiting')) bonus += 1.5
    if (includes('dehydration')) bonus += 0.9
    if (selectedRegion === 'abdomen') bonus += 0.8
  }

  if (disease.id === 'strep-throat') {
    if (soreThroatNow && includes('fever')) bonus += 1.4
    if (coughType === 'dry' || includes('cough')) bonus -= 0.4
  }

  if (SEVERE_DISEASES.has(disease.id)) {
    if (activityTolerance === 'unable') bonus += 0.9
    if (chestPainNow) bonus += 0.9
  }

  return bonus
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

  score += getConditionContextBoost(disease, context, normalizedInput)

  return Number(Math.max(0, score).toFixed(2))
}

function buildAssessmentMessage(results = [], globalSeverity = 'mild') {
  const top = results.find((result) => result.rank === 1) ?? results[0]
  if (!top) {
    return 'Your symptoms look mild at this stage. Continue rest, hydration, and monitor for any worsening signs.'
  }

  if (globalSeverity === 'serious' || globalSeverity === 'emergency') {
    return `Your pattern is currently leaning toward ${top.name}, but some higher-risk indicators were also detected.`
  }

  return `Your symptom pattern currently leans most toward ${top.name}.`
}

function confidenceFromScore(entry, maxScore, index, context = {}, normalizedInput = []) {
  const answers = context.answers ?? {}
  const overlapRatio = normalizedInput.length > 0 ? entry.matched.length / normalizedInput.length : 0
  const topRelative = maxScore > 0 ? entry.score / maxScore : 0
  const durationDays = Number(answers.durationDays) || 0
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const symptomsWorsening = Boolean(answers.symptomsWorsening)

  let confidence = 34 + overlapRatio * 38 + topRelative * 24 - index * 9
  if (entry.matched.length >= 4) confidence += 6
  if (durationDays >= 2 && durationDays <= 7) confidence += 2
  if (COMMON_FIRST_DISEASES.has(entry.id) && !symptomsWorsening) confidence += 2

  if (SEVERE_DISEASES.has(entry.id) && breathingLevel <= 4 && durationDays <= 3) confidence -= 10
  if (SEVERE_DISEASES.has(entry.id) && !normalizedInput.includes('shortness-of-breath')) confidence -= 6
  if (SEVERE_DISEASES.has(entry.id) && symptomsWorsening && breathingLevel >= 6) confidence += 6

  if (index === 0) {
    confidence = Math.max(58, confidence)
  } else if (index === 1) {
    confidence = Math.min(confidence, 76)
  } else {
    confidence = Math.min(confidence, 68)
  }

  return Math.round(Math.max(30, Math.min(92, confidence)))
}

function buildPrimaryReason(top = null, context = {}, normalizedInput = []) {
  if (!top) return ''
  const answers = context.answers ?? {}
  const durationDays = Number(answers.durationDays) || 0
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const matched = top.matched.slice(0, 4).map((symptom) => symptom.replaceAll('-', ' '))
  const symptomsText =
    matched.length > 0
      ? matched.join(', ')
      : normalizedInput.slice(0, 3).map((symptom) => symptom.replaceAll('-', ' ')).join(', ')

  const durationText =
    durationDays > 0 ? ` with symptoms for about ${durationDays} day${durationDays === 1 ? '' : 's'}` : ''
  const respiratoryText =
    breathingLevel >= 7
      ? ' and significant breathing strain'
      : breathingLevel >= 4
        ? ' and mild to moderate breathing discomfort'
        : ' without major breathing distress'

  return `This assessment leans toward ${top.name} because your symptoms include ${symptomsText}${durationText}${respiratoryText}.`
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
  const results = scored.slice(0, 4).map((entry, index) => {
    const confidence = confidenceFromScore(entry, maxScore, index, context, normalizedInput)

    return {
      ...entry,
      rank: index + 1,
      confidence,
      evidence: toEvidence(entry, normalizedInput),
      globalSeverity,
    }
  })

  const primaryResult = results[0] ?? null
  const secondaryResults = results.slice(1, 4)
  const shouldEscalate =
    globalSeverity === 'serious' || globalSeverity === 'emergency' || escalationEvidence.strongIndicators >= 2
  const seekHelpIf = shouldEscalate
    ? [
        'Breathing difficulty increases or chest pain starts/worsens',
        'Fever remains high or symptoms continue to worsen over 24-48 hours',
        'No clear improvement after 3-5 days of home care',
      ]
    : [
        'Fever worsens or lasts beyond 5 days',
        'New breathing difficulty or chest discomfort appears',
        'Symptoms persist or worsen despite rest and hydration',
      ]

  return {
    emergency: false,
    results,
    primaryResult,
    secondaryResults,
    globalSeverity,
    severityLabel: explainSeverity(globalSeverity),
    primaryReason: buildPrimaryReason(primaryResult, context, normalizedInput),
    seekHelpIf,
    assessmentMessage: buildAssessmentMessage(results, globalSeverity),
  }
}
