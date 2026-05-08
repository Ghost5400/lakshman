import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: 'stethoscope', label: 'Checker' },
  { to: '/first-aid', icon: 'medical_services', label: 'First Aid' },
  { to: '/breathe', icon: 'air', label: 'Breathe' },
]

function SideNav() {
  return (
    <aside className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-surface-container-lowest border-r border-outline-variant flex-col py-lg z-40">
      {navItems.map((item, index) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-md px-margin py-3 mx-sm rounded-lg ${
              isActive
                ? 'text-primary bg-primary-container/10 font-semibold border-l-4 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low transition-colors'
            } ${index > 0 ? 'mt-2' : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-body font-body">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </aside>
  )
}

export default SideNav
