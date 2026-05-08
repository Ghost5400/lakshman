import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: 'stethoscope', label: 'Checker' },
  { to: '/first-aid', icon: 'medical_services', label: 'First Aid' },
  { to: '/breathe', icon: 'air', label: 'Breathe' },
]

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter bg-surface-container-lowest border-t border-outline-variant h-[64px] md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-primary font-semibold scale-95' : 'text-on-secondary-fixed-variant'
            }`
          }
          aria-label={item.label}
        >
          {({ isActive }) => (
            <>
              <div className={`rounded-full px-4 py-1 mb-1 ${isActive ? 'bg-primary-container/20' : ''}`}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-micro font-micro">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
