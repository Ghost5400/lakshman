import diseases from '../data/diseases.json' with { type: 'json' }

export const EMERGENCY_SYMPTOMS = [
  'chest-pain',
  'unconsciousness',
  'seizure',
  'breathing-difficulty',
  'shortness-of-breath',
  'severe-bleeding',
]

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
  if (score >= 9) return 'emergency'
  if (score >= 7) return 'serious'
  if (score >= 4) return 'moderate'
  return 'mild'
}

function deriveSeverityScore(context = {}, matchedSymptoms = []) {
  const answers = context.answers ?? {}
  const durationDays = Number(answers.durationDays) || 0
  const painScale = Number(context.painScale ?? answers.painScale ?? 0)
  const breathingLevel = Number(answers.breathingDifficultyLevel) || 0
  const suddenOnset = Boolean(answers.suddenOnset)
  const severeWeakness = Boolean(answers.severeWeakness)
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
  if (suddenOnset) score += 1
  if (severeWeakness) score += 1
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

export function runMatcher(inputSymptoms = [], context = {}) {
  const normalizedInput = normalizeSymptoms(inputSymptoms)
  const emergencyFromAnswers = Boolean(context?.answers?.faintingEpisode || context?.answers?.severeBleeding)

  if (checkEmergency(normalizedInput) || emergencyFromAnswers) {
    return { emergency: true, results: [] }
  }

  const scored = diseases
    .map((disease) => {
      const { score, matched } = scoreDisease(normalizedInput, disease)
      return { ...disease, score, matched }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const maxScore = scored[0]?.score || 1
  const severityScore = deriveSeverityScore(context, normalizedInput)
  const globalSeverity = mapSeverityScore(severityScore)
  const results = scored.slice(0, 3).map((entry) => ({
    ...entry,
    confidence: Math.min(95, Math.max(35, Math.round((entry.score / maxScore) * 100))),
    evidence: toEvidence(entry, normalizedInput),
    globalSeverity,
  }))

  return { emergency: false, results, globalSeverity }
}
