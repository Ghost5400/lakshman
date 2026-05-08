import diseases from '../data/diseases.json' with { type: 'json' }

export const EMERGENCY_SYMPTOMS = [
  'chest-pain',
  'unconsciousness',
  'seizure',
  'breathing-difficulty',
  'severe-bleeding',
]

function normalizeSymptoms(symptoms = []) {
  return symptoms
    .map((symptom) => String(symptom).trim().toLowerCase())
    .filter(Boolean)
}

export function checkEmergency(symptoms = []) {
  const normalized = normalizeSymptoms(symptoms)
  return normalized.some((symptom) => EMERGENCY_SYMPTOMS.includes(symptom))
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

export function runMatcher(inputSymptoms = []) {
  if (checkEmergency(inputSymptoms)) {
    return { emergency: true, results: [] }
  }

  const scored = diseases
    .map((disease) => {
      const { score, matched } = scoreDisease(inputSymptoms, disease)
      return { ...disease, score, matched }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const maxScore = scored[0]?.score || 1
  const results = scored.slice(0, 3).map((entry) => ({
    ...entry,
    confidence: Math.round((entry.score / maxScore) * 100),
  }))

  return { emergency: false, results }
}
