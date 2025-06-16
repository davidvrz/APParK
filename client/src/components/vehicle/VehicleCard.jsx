import { Car, Pencil, Trash2, Info, Calendar } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"

export default function VehicleCard({ vehicle, onEdit, onDelete, index = 0 }) {
  return (
    <motion.div
      key={vehicle.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden w-full h-full flex flex-col"
    >
      {/* Área de imagen del vehículo */}
      <div className="h-64 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent"></div>
        <Car className="h-28 w-28 text-gray-400 dark:text-gray-300 transform hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Información del vehículo */}
      <div className="px-7 py-6 flex-grow">
        {/* Título del modelo centrado */}
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight mb-5">
          {vehicle.modelo}
        </h2>

        {/* Detalles del vehículo */}
        <div className="grid grid-cols-2 gap-5">
          {/* Matrícula */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
            <Info className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Matrícula</span>
            <span className="font-medium text-lg">{vehicle.matricula}</span>
          </div>

          {/* Tipo de vehículo */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/30 rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
            <Calendar className="h-6 w-6 text-emerald-500 mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tipo</span>
            <span className="font-medium">{vehicle.tipo}</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="px-7 pb-6 pt-3 flex justify-between mt-auto">
        <Button
          variant="outline"
          className="flex-1 mr-3 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-11"
          onClick={() => onEdit(vehicle)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button
          variant="outline"
          className="flex-1 ml-3 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 h-11"
          onClick={() => onDelete(vehicle)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </motion.div>
  )
}