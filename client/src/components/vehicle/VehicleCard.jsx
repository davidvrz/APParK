import { Car, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function VehicleCard({ vehicle, onEdit, onDelete, index = 0 }) {
  return (
    <motion.div
      key={vehicle.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="h-24 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{vehicle.matricula}</h3>
            <div className="flex flex-col">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {vehicle.modelo || getDefaultModelName(vehicle.tipo)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{vehicle.tipo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-end space-x-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0" 
          onClick={() => onEdit(vehicle)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
          onClick={() => onDelete(vehicle)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

/**
 * Función para obtener un nombre de modelo predeterminado según el tipo
 * cuando no se proporciona un modelo específico.
 */
function getDefaultModelName(tipo) {
  switch(tipo) {
    case 'Coche': return 'Turismo Standard';
    case 'Moto': return 'Motocicleta';
    case 'Especial': return 'Vehículo Especial';
    default: return 'Vehículo';
  }
}