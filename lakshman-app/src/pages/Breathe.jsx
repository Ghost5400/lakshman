import { useEffect, useMemo, useState } from 'react'
import BreathCircle from '../components/breathe/BreathCircle'
import BreathingTimer from '../components/breathe/BreathingTimer'

const PHASES = [
  { key: 'inhale', duration: 4 },
  { key: 'hold', duration: 4 },
  { key: 'exhale', duration: 6 },
]

function getNextPhase(currentPhase) {
  const currentIndex = PHASES.findIndex((phase) => phase.key === currentPhase)
  const nextIndex = currentIndex === -1 || currentIndex === PHASES.length - 1 ? 0 : currentIndex + 1
  return PHASES[nextIndex]
}

function Breathe() {
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [timeLeft, setTimeLeft] = useState(0)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)

  const currentPhaseDuration = useMemo(
    () => PHASES.find((phaseConfig) => phaseConfig.key === phase)?.duration ?? 0,
    [phase],
  )

  useEffect(() => {
    if (!isRunning || phase === 'idle') {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous > 1) {
          return previous - 1
        }

        const completedPhase = phase
        const upcoming = getNextPhase(completedPhase)

        if (completedPhase === 'exhale') {
          setCyclesCompleted((cycles) => cycles + 1)
        }

        setPhase(upcoming.key)
        return upcoming.duration
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, phase])

  const handleStartPause = () => {
    if (!isRunning) {
      if (phase === 'idle') {
        setPhase('inhale')
        setTimeLeft(4)
      }
      setIsRunning(true)
      return
    }

    setIsRunning(false)
  }

  return (
    <main className="flex-1 flex flex-col px-margin pt-md pb-[100px] relative">
      <div className="mb-lg mt-sm">
        <h2 className="text-h2 font-h2 text-on-surface">Breathing Assistant</h2>
        <p className="text-body font-body text-on-surface-variant mt-xs">
          Follow the 4-4-6 pattern to calm your breathing and reduce panic.
        </p>
      </div>

      <div
        className="rounded-xl p-lg flex-1 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0px 4px 24px rgba(0,104,95,0.05)',
        }}
      >
        <BreathingTimer phase={phase} cyclesCompleted={cyclesCompleted} isRunning={isRunning} />

        <BreathCircle
          phase={phase}
          timeLeft={timeLeft || currentPhaseDuration}
          isRunning={isRunning}
        />

        <button
          type="button"
          onClick={handleStartPause}
          className={`w-[64px] h-[64px] rounded-full flex items-center justify-center transition-transform active:scale-95 mt-10 ${
            isRunning
              ? 'bg-surface-container-lowest text-primary border border-outline-variant shadow-sm hover:bg-surface-container-low'
              : 'bg-primary text-on-primary shadow-[0px_8px_24px_rgba(0,104,95,0.25)] hover:scale-105'
          }`}
          aria-label={isRunning ? 'Pause breathing cycle' : 'Start breathing cycle'}
        >
          <span
            className="material-symbols-outlined text-[32px]"
            style={{ fontVariationSettings: !isRunning ? "'FILL' 1" : "'FILL' 0" }}
          >
            {isRunning ? 'pause' : 'play_arrow'}
          </span>
        </button>
        <p className="text-micro font-micro text-on-surface-variant mt-sm tracking-wider uppercase">
          {isRunning ? 'Tap to Pause' : 'Tap to Start'}
        </p>
      </div>
    </main>
  )
}

export default Breathe
