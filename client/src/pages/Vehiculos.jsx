import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert"
import { Plus, Car, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/Dialog"
import { useVehiculos } from "@/hooks/useVehiculos"
import VehicleCard from "@/components/vehicle/VehicleCard"
import VehicleForm from "@/components/vehicle/VehicleForm"

export default function Vehiculos() {
  const {
    vehiculos,
    loading,
    error,
    añadirVehiculo,
    actualizarVehiculo,
    eliminarVehiculo
  } = useVehiculos()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAddClick = () => {
    setFormError(null)
    setIsAddDialogOpen(true)
  }

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFormError(null)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFormError(null)
    setIsDeleteDialogOpen(true)
  }

  const handleAddSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await añadirVehiculo(formData)
      setIsAddDialogOpen(false)
    } catch (err) {
      setFormError(err.message || "Error al añadir el vehículo")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (formData) => {
    if (!selectedVehicle) return

    setSubmitting(true)
    try {
      await actualizarVehiculo(selectedVehicle.id, formData)
      setIsEditDialogOpen(false)
    } catch (err) {
      setFormError(err.message || "Error al actualizar el vehículo")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedVehicle) return

    setSubmitting(true)
    try {
      await eliminarVehiculo(selectedVehicle.id)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setFormError(err.message || "Error al eliminar el vehículo")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col space-y-6">
        {/* Título de la página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Vehículos</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Gestiona los vehículos registrados en tu cuenta
            </p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Vehículo
          </Button>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Lista de vehículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : vehiculos.length === 0 ? (
              <EmptyVehiclesState onAddVehicle={handleAddClick} />
            ) : (
              vehiculos.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Dialog para añadir vehículo */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Vehículo</DialogTitle>
              <DialogDescription>
                Añade un nuevo vehículo a tu cuenta
              </DialogDescription>
            </DialogHeader>

            <VehicleForm
              onSubmit={handleAddSubmit}
              isSubmitting={submitting}
              error={formError}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para editar vehículo */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Vehículo</DialogTitle>
              <DialogDescription>
                Modifica los datos de tu vehículo
              </DialogDescription>
            </DialogHeader>

            <VehicleForm
              vehicle={selectedVehicle}
              onSubmit={handleEditSubmit}
              isSubmitting={submitting}
              error={formError}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para eliminar vehículo */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Vehículo</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar este vehículo?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>

            {selectedVehicle && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedVehicle.matricula}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedVehicle.modelo || getVehicleTypeDisplay(selectedVehicle.tipo)} ({selectedVehicle.tipo})
                  </p>
                </div>
              </div>
            )}

            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : "Eliminar Vehículo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </LayoutGroup>
  )
}

/**
 * Componente que muestra un estado vacío cuando no hay vehículos.
 */
function EmptyVehiclesState({ onAddVehicle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center"
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Car className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tienes vehículos registrados</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Añade un vehículo para poder realizar reservas de aparcamiento
      </p>
      <Button onClick={onAddVehicle}>
        <Plus className="h-4 w-4 mr-2" />
        Añadir Vehículo
      </Button>
    </motion.div>
  )
}

/**
 * Función para obtener un nombre de modelo predeterminado según el tipo.
 */
function getVehicleTypeDisplay(tipo) {
  switch(tipo) {
  case 'Coche': return 'Turismo Standard'
  case 'Moto': return 'Motocicleta'
  case 'Especial': return 'Vehículo Especial'
  default: return 'Vehículo'
  }
}