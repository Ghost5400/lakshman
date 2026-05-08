import { useLocation } from 'react-router-dom'

function AppHeader() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="bg-surface shadow-sm sticky top-0 w-full flex justify-between items-center px-margin h-16 z-40">
      <div className="flex items-center gap-sm">
        <span
          className="material-symbols-outlined text-primary text-[24px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          emergency_home
        </span>
        <div className="flex flex-col">
          <h1 className="text-h1 font-h1 font-extrabold text-primary tracking-tight">LAKSHMAN</h1>
          <span className="text-micro font-micro text-on-surface-variant">Offline Health Assistant</span>
        </div>
      </div>

      {isHome ? (
        <div className="flex items-center bg-surface-container-low px-sm py-xs rounded-full border border-primary/20">
          <span
            className="material-symbols-outlined text-primary text-[14px] mr-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span className="text-micro font-micro text-primary font-semibold">Offline Ready</span>
        </div>
      ) : (
        <div className="w-10" />
      )}
    </header>
  )
}

export default AppHeader
