import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import classNames from 'classnames'

function HeaderBar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="sticky top-0 z-50 flex items-start justify-between px-4 py-2 w-full max-w-7xl mx-auto space-x-4">
      {/* Isla izquierda: logo */}
      <div className="bg-transparent">
        <div className="text-xl font-heading text-primary font-bold">SmartPark</div>
      </div>

      {/* Isla central: navegación sticky */}
      <div className="hidden md:flex gap-6 px-6 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/20 shadow text-sm font-medium text-dark sticky top-4 z-40">
        <Link to="/dashboard" className={`transition ${currentPath === '/dashboard' ? 'text-primary font-semibold' : 'text-dark'}`}>Inicio</Link>
        <Link to="/dashboard/historial" className={`transition ${currentPath === '/dashboard/historial' ? 'text-primary font-semibold' : 'text-dark'}`}>Historial</Link>
        <Link to="/dashboard/nueva" className={`transition ${currentPath === '/dashboard/nueva' ? 'text-primary font-semibold' : 'text-dark'}`}>Nueva reserva</Link>
      </div>

      {/* Isla derecha: notificaciones y perfil sticky */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/20 shadow text-dark sticky top-4 z-40">
        <button className="hover:text-primary transition">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
        </button>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center gap-2 text-dark hover:text-primary transition">
              <FontAwesomeIcon icon={faUser} />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition duration-150 ease-out"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition duration-100 ease-in"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
              <Menu.Item as="div">
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={classNames('block w-full text-left px-4 py-2 text-sm', {
                      'bg-gray-100': active
                    })}
                  >
                    Cerrar sesión
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* ✅ Mobile: menú hamburguesa */}
      <div className="md:hidden">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="text-dark">
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition duration-150 ease-out"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition duration-100 ease-in"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/10 focus:outline-none z-50">
              <Menu.Item as="div">
                {({ active }) => (
                  <Link
                    to="/dashboard"
                    className={classNames('block px-4 py-2 text-sm', {
                      'bg-gray-100': active
                    })}
                  >
                    Inicio
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item as="div">
                {({ active }) => (
                  <Link
                    to="/dashboard/historial"
                    className={classNames('block px-4 py-2 text-sm', {
                      'bg-gray-100': active
                    })}
                  >
                    Historial
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item as="div">
                {({ active }) => (
                  <Link
                    to="/dashboard/nueva"
                    className={classNames('block px-4 py-2 text-sm', {
                      'bg-gray-100': active
                    })}
                  >
                    Nueva reserva
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item as="div">
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={classNames('block w-full text-left px-4 py-2 text-sm', {
                      'bg-gray-100': active
                    })}
                  >
                    Cerrar sesión
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default HeaderBar
