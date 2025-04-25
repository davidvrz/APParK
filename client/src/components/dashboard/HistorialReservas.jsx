import ReservaCard from '../ui/ReservaCard'
import { useHistorial } from '../../hooks/useHistorial'
import { motion } from 'framer-motion'

function HistorialReservas({ modo = 'horizontal', limite = null }) {
  const { reservas, loading } = useHistorial(limite)

  if (loading) {
    return (
      <div className="text-sm text-grayText">Cargando historial de reservas...</div>
    )
  }

  if (reservas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl bg-white/30 backdrop-blur-md border border-white/20 text-center text-grayText"
      >
        No tienes historial de reservas.
      </motion.div>
    )
  }

  return modo === 'horizontal' ? (
    <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
      {reservas.map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} esHistorial />
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      {reservas.map((reserva) => (
        <ReservaCard key={reserva.id} reserva={reserva} esHistorial />
      ))}
    </div>
  )
}

export default HistorialReservas
