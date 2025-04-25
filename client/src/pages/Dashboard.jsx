import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import ReservasActivas from '../components/dashboard/ReservasActivas'
import HistorialReservas from '../components/dashboard/HistorialReservas'
import { motion } from 'framer-motion'

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="pb-24 space-y-8">
      {/* Sección de bienvenida */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl shadow-xl bg-white/30 backdrop-blur-md border border-white/20"
      >
        <h1 className="text-2xl font-heading text-dark mb-2">
          ¡Hola, <span className="text-primary">{user?.email}</span>!
        </h1>
        <p className="text-sm text-grayText">Aquí puedes gestionar tus reservas y vehículos.</p>
      </motion.section>

      {/* Reservas activas */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-4 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20"
      >
        <h2 className="font-heading text-lg text-dark mb-4">Reservas activas</h2>
        <ReservasActivas modo="pila" />
      </motion.section>

      {/* Historial horizontal */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-4 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-lg text-dark">Historial reciente</h2>
          <Link to="/dashboard/historial" className="text-sm text-primary hover:underline">
            Ver todo →
          </Link>
        </div>
        <HistorialReservas modo="horizontal" limite={5} />
      </motion.section>

      {/* Acciones rápidas */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="p-4 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md border border-white/20"
      >
        <h2 className="font-heading text-lg text-dark mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/dashboard/nueva"
            className="p-4 bg-primary text-white rounded-xl shadow hover:bg-primary/90 transition-all text-center"
          >
            Nueva reserva
          </Link>
          <Link
            to="/perfil"
            className="p-4 bg-accent/90 text-white rounded-xl shadow hover:bg-accent transition-all text-center"
          >
            Mis vehículos
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default Dashboard