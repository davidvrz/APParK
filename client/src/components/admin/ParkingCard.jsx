import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { MapPin, Car, Edit3, Trash2, Eye, Building2, AlertTriangle, AlertCircle, Megaphone } from "lucide-react"
import { toast } from "sonner"

const ParkingCard = ({ parking, onEdit, onView, onDelete, onManageAnuncios }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(parking.id)
      toast.success('Parking eliminado correctamente')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error al eliminar parking:', error)
      toast.error(error.response?.data?.message || 'Error al eliminar parking')
    } finally {
      setIsDeleting(false)
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
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {parking.nombre}
              </CardTitle>
              <div className="flex items-start gap-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="truncate text-xs leading-4" title={parking.ubicacion}>
                  {parking.ubicacion}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${getEstadoBadge(parking.estado)} text-xs font-medium flex-shrink-0`}
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
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onView(parking)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onEdit(parking)}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onManageAnuncios?.(parking)}
            >
              <Megaphone className="h-3 w-3 mr-1" />
              Anuncios
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600 font-display tracking-tight">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Eliminar Parking
            </DialogTitle>
            <DialogDescription className="font-normal text-gray-600 dark:text-gray-400">
              Esta es una acción <strong>permanente e irreversible</strong>
            </DialogDescription>
          </DialogHeader>

          {/* Información del parking a eliminar */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium text-red-800 dark:text-red-200">
                  {parking.nombre}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {parking.ubicacion}
                </p>
                <div className="text-sm text-red-600 dark:text-red-400">
                  <strong>Capacidad:</strong> {parking.capacidad} plazas • <strong>Plantas:</strong> {parking.plantas?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia detallada */}
          <Alert variant="destructive" className="border-red-200 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-display font-semibold">¡Atención!</AlertTitle>
            <AlertDescription className="font-normal text-sm mt-2">
              Al eliminar este parking se perderán <strong>permanentemente</strong>:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Todas las plantas y plazas configuradas</li>
                <li>Todas las reservas activas y futuras</li>
                <li>Todo el historial de reservas</li>
                <li>Todos los anuncios asociados</li>
                <li>Todas las configuraciones y datos</li>
              </ul>
            </AlertDescription>
          </Alert>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="font-medium"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="font-medium min-w-[140px]"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Eliminando...
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Parking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default ParkingCard
