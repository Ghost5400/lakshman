const EMERGENCY_STEPS = [
  'Stay calm',
  'Call emergency services',
  'Do not move the person unless in danger',
  'Keep them comfortable until help arrives',
]

function EmergencyModal({ onDismiss }) {
  return (
    <div
      className="fixed inset-0 bg-error z-[100] flex flex-col justify-center items-center px-margin emergency-enter"
      role="alertdialog"
      aria-modal="true"
      aria-label="Emergency Detected"
    >
      <main className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-xl animate-[pulse-slow_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
          <span
            className="material-symbols-outlined text-[80px] text-on-error drop-shadow-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            emergency
          </span>
        </div>

        <h1 className="font-display text-display text-on-error font-extrabold text-center mb-xl tracking-tight">
          EMERGENCY DETECTED
        </h1>

        <div className="flex flex-col gap-md w-full mb-xl">
          {EMERGENCY_STEPS.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-md bg-on-error/10 p-md rounded-xl border border-on-error/20"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-on-error flex items-center justify-center">
                <span className="font-h1 text-h1 text-error font-bold">{index + 1}</span>
              </div>
              <p className="font-h2 text-h2 text-on-error">{step}</p>
            </div>
          ))}
        </div>

        <a
          href="tel:108"
          className="w-full bg-on-error text-error py-4 px-md rounded-xl shadow-[0px_8px_24px_rgba(0,0,0,0.2)] flex items-center justify-center gap-sm mb-lg hover:bg-surface-bright transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            call
          </span>
          <span className="font-h2 text-h2 font-bold tracking-wide">CALL 108 - AMBULANCE</span>
        </a>

        <button
          type="button"
          className="font-small text-small text-on-error/70 underline underline-offset-4 hover:text-on-error transition-colors mt-lg pb-xl"
          onClick={onDismiss}
        >
          I understand, go back
        </button>
      </main>
    </div>
  )
}

export default EmergencyModal
