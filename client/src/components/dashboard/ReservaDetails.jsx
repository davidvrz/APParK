import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function ReservaDetails({ reserva, onClose }) {
  const { plaza, startTime, endTime, precioTotal } = reserva

  return (
    <motion.div
      layout
      layoutId={`reserva-${reserva.id}`}
      initial={{ borderRadius: 20 }}
      animate={{ borderRadius: 16 }}
      exit={{ opacity: 0 }}
      className="col-span-full p-6 bg-white rounded-2xl shadow-xl border border-gray-200 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-primary transition"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h3 className="text-xl font-semibold text-primary mb-2">
        {plaza.parking?.nombre || 'Parking desconocido'}
      </h3>

      <p className="text-sm text-gray-600 mb-1">
        Plaza {plaza.numero} ({plaza.tipo}) - Planta: {plaza.planta?.nombre || '-'}
      </p>

      <p className="text-sm text-gray-600 mb-1">
        Inicio: {new Date(startTime).toLocaleString('es-ES')}
      </p>
      <p className="text-sm text-gray-600 mb-3">
        Fin: {new Date(endTime).toLocaleString('es-ES')}
      </p>

      <p className="text-md font-semibold text-accent">Total: {precioTotal} €</p>

      {/* Aquí puedes poner un mini mapa con la ubicación si quieres */}
      <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        Mapa o ubicación
      </div>
    </motion.div>
  )
}

export default ReservaDetails
