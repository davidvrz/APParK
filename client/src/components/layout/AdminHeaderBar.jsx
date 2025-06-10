import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Menu, User, LogOut, Database, Activity, Users, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { useAuth } from "@/hooks/useAuth"
import ThemeToggle from "../ui/ThemeToggle"

function AdminHeaderBar() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  const currentPath = location.pathname

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleViewAsUser = () => {
    navigate("/dashboard")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Gradiente azul para admin
  const activeGradient = "from-blue-500 to-indigo-600"
  const navItems = [
    { icon: <Settings className={`h-5 w-5 ${isScrolled && currentPath === "/admin/dashboard" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, mobileIcon: <Settings className="h-4 w-4" />, label: "Panel Admin", path: "/admin/dashboard" },
    { icon: <Database className={`h-5 w-5 ${isScrolled && currentPath === "/admin/parkings" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, mobileIcon: <Database className="h-4 w-4" />, label: "Parkings", path: "/admin/parkings" },
    { icon: <Activity className={`h-5 w-5 ${isScrolled && currentPath === "/admin/eventos" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, mobileIcon: <Activity className="h-4 w-4" />, label: "Eventos", path: "/admin/eventos" },
    { icon: <Users className={`h-5 w-5 ${isScrolled && currentPath === "/admin/usuarios" ? "mr-2" : isScrolled ? "mx-auto" : "mr-2"}`} />, mobileIcon: <Users className="h-4 w-4" />, label: "Usuarios", path: "/admin/usuarios" },
  ]

  return (
    <div className="sticky top-0 z-50 flex justify-between items-start w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-3">

      {/* Isla izquierda: logo con badge admin */}
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
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            APParK
          </span>
          <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full">
            Admin
          </span>
        </Link>
      </motion.div>

      {/* Isla central: navegación sticky admin */}
      <motion.div
        className="hidden md:flex gap-1 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg shadow-md text-sm font-medium text-gray-800 dark:text-gray-200"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{
          paddingLeft: isScrolled ? "0.75rem" : "1rem",
          paddingRight: isScrolled ? "0.75rem" : "1rem",
          gap: isScrolled ? "0.5rem" : "0.75rem",
          transition: "padding 0.3s ease, gap 0.3s ease"
        }}
      >
        {navItems.map((item) => {
          const isActive = currentPath === item.path
          return (
            <Link key={item.path} to={item.path} className="relative">
              <motion.div
                className="flex items-center px-3 py-1.5 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  paddingLeft: "0.3rem",
                  paddingRight: "0.3rem",
                }}
              >
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
              </motion.div>
            </Link>
          )
        })}
      </motion.div>

      {/* Isla derecha: perfil admin sticky */}
      <motion.div
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg shadow text-gray-800 dark:text-gray-200 sticky top-4 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.button
          onClick={handleViewAsUser}
          className="flex items-center gap-1 px-1 py-1 text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Usuario"
        >
          <Eye className="h-5 w-5" />
          <span className="hidden lg:inline">Usuario</span>
        </motion.button>

        <ThemeToggle />
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

      {/* Mobile: menú hamburguesa admin */}
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
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
            {navItems.map((item) => {
              const isActive = currentPath === item.path
              return (
                <DropdownMenuItem key={item.path} asChild>
                  <Link
                    to={item.path}
                    className={`cursor-pointer font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}                  >
                    <div className="mr-2">
                      {item.mobileIcon}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
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
            <DropdownMenuItem onClick={handleViewAsUser} className="cursor-pointer font-medium">
              <Eye className="h-4 w-4 mr-2" />
              <span>Ver como Usuario</span>
            </DropdownMenuItem>
            <div className="flex items-center justify-between px-2 py-1 border-t border-gray-200 dark:border-gray-700 mt-1 pt-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Modo oscuro</span>
              <ThemeToggle />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AdminHeaderBar
