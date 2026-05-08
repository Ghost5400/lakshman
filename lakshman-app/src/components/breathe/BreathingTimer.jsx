const PHASE_COPY = {
  idle: {
    title: 'Ready',
    helper: 'Tap start to begin a calming breathing cycle.',
  },
  inhale: {
    title: 'Inhale',
    helper: 'Breathe in slowly and deeply through your nose.',
  },
  hold: {
    title: 'Hold',
    helper: 'Hold your breath gently. Relax your shoulders.',
  },
  exhale: {
    title: 'Exhale',
    helper: 'Breathe out slowly through your mouth.',
  },
}

const PHASE_PILLS = [
  { key: 'inhale', label: 'Inhale 4s' },
  { key: 'hold', label: 'Hold 4s' },
  { key: 'exhale', label: 'Exhale 6s' },
]

function BreathingTimer({ phase, cyclesCompleted, isRunning }) {
  const content = PHASE_COPY[phase]

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-lg">
        <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">spa</span>
        </div>
        <div className="bg-surface-container-low px-md py-sm rounded-full text-small font-small text-on-surface-variant flex items-center gap-xs">
          <span className="material-symbols-outlined text-[16px]">cycle</span>
          Cycles completed: {cyclesCompleted}
        </div>
        <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">timer</span>
        </div>
      </div>

      <div className="flex items-center gap-sm mb-10 z-10 bg-surface-container-lowest p-1 rounded-full shadow-sm border border-outline-variant/30">
        {PHASE_PILLS.map((pill) => {
          const isActive = isRunning && phase === pill.key

          return (
            <div
              key={pill.key}
              className={`px-4 py-2 rounded-full text-small font-small transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant opacity-60'
              }`}
            >
              {pill.label}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center z-10 flex flex-col items-center gap-2">
        <h2 className="text-display font-display text-primary">{content.title}</h2>
        <p className="text-body font-body text-on-surface-variant max-w-[260px]">{content.helper}</p>
      </div>
    </div>
  )
}

export default BreathingTimer
