import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Menu, User, LogOut, Car, LayoutDashboard } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { useAuth } from "@/hooks/useAuth"

function HeaderBar() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  const currentPath = location.pathname

  // Determinar si la ruta actual está relacionada con dashboard
  const isDashboardPath = currentPath === "/dashboard" ||
                          currentPath.startsWith("/reservas/")

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Usamos el mismo gradiente para todas las secciones
  const activeGradient = "from-purple-500 to-pink-600"

  const navItems = [
    { icon: <LayoutDashboard className={`h-5 w-5 ${isScrolled && isDashboardPath ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Map className={`h-5 w-5 ${isScrolled && currentPath === "/map" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, label: "Mapa", path: "/map" },
    { icon: <Car className={`h-5 w-5 ${isScrolled && currentPath === "/vehiculos" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, label: "Mis Vehículos", path: "/vehiculos" },
  ]

  return (
    <div className="sticky top-0 z-50 flex justify-between items-start w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-3">
      {/* Isla izquierda: logo */}
      <motion.div
        className="px-4 py-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: isScrolled ? 0 : 1,
          scale: isScrolled ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            APParK
          </span>
        </Link>
      </motion.div>

      {/* Isla central: navegación sticky */}
      <motion.div
        className="hidden md:flex gap-1 px-4 py-2 rounded-full bg-white/60 backdrop-blur-lg shadow-md text-sm font-medium text-gray-800 dark:text-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          paddingLeft: isScrolled ? "0.75rem" : "1rem",
          paddingRight: isScrolled ? "0.75rem" : "1rem",
          gap: isScrolled ? "0.5rem" : "0.75rem",
        }}
        transition={{ duration: 0.3 }}
      >
        {navItems.map((item) => {
          const isActive = item.path === "/dashboard" ? isDashboardPath : currentPath === item.path
          return (
            <Link key={item.path} to={item.path} className="relative">
              <motion.div
                className="flex items-center px-3 py-1.5 transition-all duration-300 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  paddingLeft: "0.3rem",
                  paddingRight: "0.3rem",
                }}
              >
                <div className="flex items-center relative z-10">
                  {item.icon}
                  <AnimatePresence>
                    {(!isScrolled || isActive) && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`${isActive ? `font-display font-medium tracking-tight bg-gradient-to-r ${activeGradient} bg-clip-text text-transparent` : "font-medium"} whitespace-nowrap overflow-hidden`}
                      >
                        {isScrolled && isActive ? item.label : !isScrolled ? item.label : ""}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </motion.div>      {/* Isla derecha: perfil sticky */}
      <motion.div
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-lg shadow text-gray-800 dark:text-gray-200 sticky top-4 z-40"
        animate={{
          scale: isScrolled ? 0.9 : 1,
          paddingLeft: isScrolled ? "0.75rem" : "1rem",
          paddingRight: isScrolled ? "0.75rem" : "1rem",
        }}
        transition={{ duration: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="h-5 w-5" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link to="/perfil">
                <User className="h-4 w-4 mr-2" />
                <span>Configurar perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-medium">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Mobile: menú hamburguesa */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="text-gray-800 dark:text-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            {navItems.map((item) => {
              const isActive = item.path === "/dashboard" ? isDashboardPath : currentPath === item.path
              return (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className={`cursor-pointer font-medium ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`}
                  >
                    <div className="mr-2">{item.icon}</div>
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              )            })}
            <DropdownMenuItem asChild className="cursor-pointer font-medium">
              <Link to="/perfil">
                <User className="h-4 w-4 mr-2" />
                <span>Configurar perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-medium">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeaderBar
