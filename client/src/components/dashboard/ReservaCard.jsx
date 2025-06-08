import { motion } from "framer-motion"
import { Clock, MapPin, Calendar, Car, Edit, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatTime(dateString) {
  return format(new Date(dateString), "HH:mm", { locale: es })
}

function formatDate(dateString) {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es })
}

function ReservaCard({ reservation, onExpand, onEdit, onCancel }) {
  const startTime = formatTime(reservation.startTime)
  const endTime = formatTime(reservation.endTime)
  const startDate = formatDate(reservation.startTime)
  const parkingName = reservation.parking?.nombre || "Parking desconocido"
  const parkingAddress = reservation.parking?.ubicacion || "Ubicación no disponible"
  const plazaNumber = reservation.plaza?.numero || "N/A"
  const price = reservation.precioTotal ? `${reservation.precioTotal} €` : "0.00 €"

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className="h-full flex flex-col cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
      onClick={onExpand}
    >
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-3 px-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-medium tracking-tight">{parkingName}</h3>
          <div className="text-xs px-2 py-1 bg-white/20 rounded-full font-medium">
            Activa
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow p-5 space-y-3 bg-white dark:bg-gray-800">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="line-clamp-1 font-normal">{parkingAddress}</span>
        </div>

        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
          <span className="font-medium">{startDate}</span>
        </div>

        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
          <span className="font-normal">{startTime} - {endTime}</span>
        </div>

        <div className="flex items-center text-sm">
          <Car className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
          <span className="font-normal">
            {reservation.vehicle?.modelo || "Vehículo"} — {reservation.vehicle?.matricula || "N/A"} · Plaza {plazaNumber}
          </span>
        </div>
      </div>

      {/* Pie con precio y acciones */}
      <div className="px-5 py-3 flex justify-between items-center bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="text-right font-display font-bold text-lg tracking-tight">
          {price}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 rounded-full font-medium hover:scale-105 active:scale-95 transition-transform duration-150"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(e)
            }}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:scale-105 active:scale-95 transition-all duration-150 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onCancel(e)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Indicador de expandir */}
      <div className="flex justify-center py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </motion.div>
  )
}

export default ReservaCard
