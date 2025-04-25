import { motion } from 'framer-motion'

function ReservaCard({ reserva, onCancelar, onModificar, esHistorial = false }) {
  const { id, plaza, startTime, endTime, precioTotal } = reserva

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short'
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-w-[260px] max-w-xs bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 flex-shrink-0"
    >
      <h3 className="text-lg font-semibold text-primary mb-1">
        {plaza.parking?.nombre || 'Parking desconocido'}
      </h3>
      <p className="text-sm text-grayText mb-1">
        Plaza <strong>{plaza.numero}</strong> ({plaza.tipo})
      </p>

      <div className="text-sm text-dark space-y-1 mb-2">
        <p><strong>Planta:</strong> {plaza.planta?.nombre || '-'}</p>
        <p><strong>Inicio:</strong> {formatearFecha(startTime)}</p>
        <p><strong>Fin:</strong> {formatearFecha(endTime)}</p>
      </div>

      {esHistorial && (
        <p className="text-sm text-accent font-semibold mb-2">
          Total: {precioTotal} €
        </p>
      )}

      {!esHistorial && (
        <div className="flex gap-2 mt-2">
          {onModificar && (
            <button
              onClick={() => onModificar(id)}
              className="text-sm px-3 py-1 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition-all"
            >
              Modificar
            </button>
          )}
          {onCancelar && (
            <button
              onClick={() => onCancelar(id)}
              className="text-sm px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ReservaCard
