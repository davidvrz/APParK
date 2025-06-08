import { Button } from "@/components/ui/Button"
import { Car, Plus } from "lucide-react"

export default function EmptyVehiclesState({ onAddVehicle }) {
  return (
    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">

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
    </div>
  )
}
