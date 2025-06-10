import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import {
  MapPin,
  Car,
  Edit3,
  Trash2,
  Eye,
  Building2
} from "lucide-react"
import { useParking } from "@/hooks/useParking"
import { toast } from "sonner"

const ParkingCard = ({ parking, onEdit, onView }) => {
  const { deleteParking } = useParking()

  const handleDelete = async () => {
    try {
      await deleteParking(parking.id)
      toast.success('Parking eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar parking')
    }
  }
  const getEstadoBadge = (estado) => {
    const variants = {
      'Operativo': 'bg-green-100 text-green-800 border-green-200',
      'Cerrado': 'bg-red-100 text-red-800 border-red-200',
      'Mantenimiento': 'bg-amber-100 text-amber-800 border-amber-200'
    }

    return variants[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const ocupacionPorcentaje = parking.capacidad > 0
    ? Math.round(((parking.plazasOcupadas || 0) + (parking.plazasReservadas || 0)) / parking.capacidad * 100)
    : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {parking.nombre}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{parking.ubicacion}</span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`${getEstadoBadge(parking.estado)} text-xs font-medium`}
            >
              {parking.estado}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {parking.capacidad || 0}
                </div>
                <div className="text-xs text-gray-500">Total plazas</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {parking.plantas?.length || 0}
                </div>
                <div className="text-xs text-gray-500">Plantas</div>
              </div>
            </div>
          </div>

          {/* Barra de ocupación */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ocupación
              </span>
              <span className="text-sm text-gray-500">
                {ocupacionPorcentaje}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${ocupacionPorcentaje}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Libres: {parking.plazasLibres || 0}</span>
              <span>Ocupadas: {(parking.plazasOcupadas || 0) + (parking.plazasReservadas || 0)}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => onView(parking)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => onEdit(parking)}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Editar
            </Button>            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ParkingCard
