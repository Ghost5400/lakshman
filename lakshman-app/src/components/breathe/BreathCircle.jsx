const CIRCLE_SIZES = {
  idle: 'w-[200px] h-[200px]',
  inhale: 'w-[240px] h-[240px]',
  hold: 'w-[240px] h-[240px]',
  exhale: 'w-[160px] h-[160px]',
}

const RING_SCALE = {
  idle: 'scale-[1.05]',
  inhale: 'scale-[1.28]',
  hold: 'scale-[1.2]',
  exhale: 'scale-[1.04]',
}

const SECONDARY_RING_SCALE = {
  idle: 'scale-[1.15]',
  inhale: 'scale-[1.38]',
  hold: 'scale-[1.3]',
  exhale: 'scale-[1.1]',
}

function BreathCircle({ phase, timeLeft, isRunning }) {
  const isActive = phase !== 'idle'
  const phaseLabel = phase === 'idle' ? 'Ready' : phase[0].toUpperCase() + phase.slice(1)

  return (
    <div className="relative flex items-center justify-center my-8">
      <div
        className={`absolute rounded-full bg-primary-container/30 blur-md transition-transform duration-500 ease-in-out ${
          RING_SCALE[phase]
        } ${isActive ? 'opacity-100' : 'opacity-70'} w-[220px] h-[220px]`}
      />
      <div
        className={`absolute rounded-full bg-primary/20 blur-sm transition-transform duration-500 ease-in-out ${
          SECONDARY_RING_SCALE[phase]
        } ${isActive ? 'opacity-100' : 'opacity-60'} w-[220px] h-[220px]`}
      />

      <div
        className={`breathe-circle relative rounded-full bg-surface-container-lowest border-[3px] border-primary shadow-[0_8px_32px_rgba(0,104,95,0.15)] flex flex-col items-center justify-center z-20 ${
          CIRCLE_SIZES[phase]
        }`}
      >
        {isActive ? (
          <>
            <span className="text-[80px] leading-none font-display font-bold text-primary tracking-tighter">
              {timeLeft}
            </span>
            <span className="text-small font-small text-on-surface-variant tracking-widest uppercase mt-xs">
              {phaseLabel}
            </span>
          </>
        ) : (
          <div className="w-4 h-4 rounded-full bg-primary shadow-sm" />
        )}
      </div>

      {!isRunning && (
        <>
          <div className="absolute w-[260px] h-[260px] rounded-full border border-primary-fixed opacity-20" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-primary-fixed opacity-10" />
        </>
      )}
    </div>
  )
}

export default BreathCircle
