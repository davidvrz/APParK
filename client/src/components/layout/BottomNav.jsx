import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faMapMarkedAlt, faUser } from '@fortawesome/free-solid-svg-icons'

const navItems = [
  { to: '/dashboard', icon: faHome, label: 'Inicio' },
  { to: '/mapa', icon: faMapMarkedAlt, label: 'Mapa' },
  { to: '/perfil', icon: faUser, label: 'Perfil' }
]

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-t border-white/30 shadow-sm dark:bg-black/70 dark:border-white/10">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs font-medium transition duration-200 ease-in-out ${
                isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <FontAwesomeIcon icon={icon} className="text-xl mb-0.5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
