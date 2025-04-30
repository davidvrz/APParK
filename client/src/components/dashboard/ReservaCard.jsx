import { motion } from "framer-motion";
import { Clock, MapPin, Calendar, Car, ExternalLink, Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatTime(dateString) {
  return format(new Date(dateString), "HH:mm", { locale: es });
}

function formatDate(dateString) {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
}

function ReservaCard({ reservation, onExpand, onViewDetails, onEdit, onDelete, isExpanded  }) {
  const startTime = formatTime(reservation.startTime);
  const endTime = formatTime(reservation.endTime);
  const startDate = formatDate(reservation.startTime);
  const parkingName = reservation.parking?.nombre || "Parking desconocido";
  const parkingAddress = reservation.parking?.ubicacion || "Ubicación no disponible";
  const carPlate = reservation.vehicle?.matricula || "Vehículo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
      onClick={onExpand}
    >
      <div className="flex items-start justify-between">
        {/* Info de la reserva */}
        <div>
          <h3 className="font-medium text-lg">{parkingName}</h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{parkingAddress}</span>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center text-sm mr-4">
              <Clock className="h-3 w-3 mr-1 text-blue-500" />
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
              <span>{startDate}</span>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center text-sm">
              <Car className="h-3 w-3 mr-1 text-blue-500" />
              <span>{carPlate}</span>
            </div>
          </div>
        </div>

        {/* Precio y acciones */}
        <div className="text-right">
          <div className="font-bold">{reservation.precioTotal ? `${reservation.precioTotal} €` : "Precio N/D"}</div>

          <div className="flex mt-2 space-x-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={onViewDetails}>
              <ExternalLink className="h-3 w-3" />
              <span className="sr-only">Ver detalles</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={onEdit}>
              <Edit className="h-3 w-3" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Cancelar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Icono de expandir */}
      <div className="flex justify-center mt-2">
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>
    </motion.div>
  );
}

export default ReservaCard;
