function toLabel(symptom) {
  return symptom
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const severityMap = {
  low: {
    badgeClass: 'bg-surface-container-low',
    textClass: 'text-primary',
    icon: 'check_circle',
    label: 'Low Severity',
    barClass: 'bg-primary',
  },
  medium: {
    badgeClass: 'bg-secondary-container',
    textClass: 'text-secondary',
    icon: 'info',
    label: 'Medium Severity',
    barClass: 'bg-secondary',
  },
  high: {
    badgeClass: 'bg-error-container',
    textClass: 'text-error',
    icon: 'warning',
    label: 'High Severity',
    barClass: 'bg-error opacity-80',
  },
}

function ResultCard({ result, isTopResult }) {
  const severity = severityMap[result.severity] ?? severityMap.medium
  const showDoctorNudge = result.severity === 'high' || result.seekHelp

  return (
    <article
      className={`bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-md flex flex-col gap-md ${
        isTopResult ? 'border-l-[4px] border-l-primary' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-sm">
        <div className="flex flex-col gap-xs">
          <h2 className="font-h2 text-h2 text-on-surface">{result.name}</h2>
          <p className="font-small text-small text-on-surface-variant">{result.summary}</p>
        </div>
        <div
          className={`px-sm py-xs rounded-full flex items-center gap-xs shrink-0 ${severity.badgeClass}`}
        >
          <span
            className={`material-symbols-outlined text-[14px] ${severity.textClass}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {severity.icon}
          </span>
          <span className={`font-micro text-micro font-semibold ${severity.textClass}`}>
            {severity.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-xs bg-surface-bright p-sm rounded-lg border border-surface-dim">
        <div className="flex justify-between items-center">
          <span className="font-small text-small text-on-surface-variant font-medium">
            Match Confidence
          </span>
          <span className="font-h3 text-h3 text-primary">{result.confidence}%</span>
        </div>
        <div
          className="w-full bg-surface-dim rounded-full h-[8px] overflow-hidden"
          role="progressbar"
          aria-valuenow={result.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${severity.barClass}`}
            style={{
              width: `${result.confidence}%`,
              animation: 'grow-width 1000ms ease-out',
            }}
          />
        </div>
      </div>

      {Array.isArray(result.precautions) && result.precautions.length > 0 && (
        <div className="flex flex-col gap-sm">
          <span className="font-micro text-micro text-on-surface-variant uppercase tracking-wider">
            Precautions
          </span>
          <ul className="space-y-xs">
            {result.precautions.map((item) => (
              <li key={item} className="text-body font-body text-on-surface-variant">
                - {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.matched?.length > 0 && !isTopResult && (
        <div className="flex flex-col gap-sm mt-xs">
          <span className="font-micro text-micro text-on-surface-variant uppercase tracking-wider">
            Matched Symptoms
          </span>
          <div className="flex flex-wrap gap-sm">
            {result.matched.map((symptom) => (
              <span
                key={symptom}
                className="bg-surface-container text-on-surface-variant px-sm py-xs rounded-lg font-small text-small border border-surface-dim"
              >
                {toLabel(symptom)}
              </span>
            ))}
          </div>
        </div>
      )}

      {showDoctorNudge && (
        <div className="bg-secondary-container px-md py-sm flex items-start gap-sm border-t border-outline-variant -mx-md -mb-md rounded-b-xl mt-sm">
          <span className="material-symbols-outlined text-on-secondary-container mt-[2px]">
            local_hospital
          </span>
          <p className="font-small text-small text-on-secondary-container font-medium leading-relaxed">
            This may require medical attention. Consider consulting a healthcare professional.
          </p>
        </div>
      )}
    </article>
  )
}

export default ResultCard
