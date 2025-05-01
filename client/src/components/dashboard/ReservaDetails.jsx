import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Calendar,
  Car,
  Ticket,
  ChevronUp,
  Navigation,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatTime(dateString) {
  return format(new Date(dateString), "HH:mm", { locale: es });
}

function formatDate(dateString) {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
}

function ReservaDetails({ reservation, onClose, onDelete, onEdit }) {
  const parkingName = reservation.parking?.nombre || "Parking desconocido";
  const parkingAddress = reservation.parking?.ubicacion || "Ubicación no disponible";
  const parkingSpot = reservation.plaza?.numero || "N/D";
  const floor = reservation.planta?.numero || "N/D";
  const carPlate = reservation.vehicle?.matricula || "Vehículo";
  const price = reservation.precioTotal ? `${reservation.precioTotal} €` : "Precio N/D";

  return (
    <motion.div
      key="expanded-view"
      initial={{ opacity: 0, height: 300, scale: 0.98 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 300, scale: 0.98 }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 150, 
        duration: 0.3 
      }}
      className="rounded-xl overflow-hidden relative bg-white dark:bg-gray-800 shadow-md"
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Detalles de Reserva</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenido con detalles y mapa */}
      <div className="flex flex-col lg:flex-row"> 
        {/* Columna de detalles (izquierda) */}
        <div className="flex-1 p-6 space-y-6">
          {/* Información principal */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-lg mb-2">{parkingName}</h4>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
              <span>{parkingAddress}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Entrada</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">{formatTime(reservation.startTime)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm">{formatDate(reservation.startTime)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salida</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">{formatTime(reservation.endTime)}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm">{formatDate(reservation.endTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={Car} title="Vehículo" content={carPlate} />
            <InfoCard icon={Ticket} title="Plaza de Parking" content={`Plaza ${parkingSpot} - Planta ${floor}`} />
          </div>

          {/* Precio y acciones */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {price}
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 px-3 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(e);
                }}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline" 
                className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(e);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="text-lg font-bold flex items-center text-green-500">
            <Clock className="h-5 w-5 mr-2" />
            <span>Reserva Activa</span>
          </div>
        </div>
        
        {/* Mapa (derecha) */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-700 relative min-h-[300px]">
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Navigation className="h-10 w-10 text-blue-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Mapa de ubicación</p>
            <div className="text-xs text-center text-gray-400 mt-2">
              Parking {parkingName}<br />
              Plaza {parkingSpot}
            </div>
          </div>
        </div>
      </div>

      {/* Botón para minimizar */}
      <div className="flex justify-center border-t border-gray-200 dark:border-gray-700 py-2">
        <Button
          variant="ghost"
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs">Minimizar</span>
        </Button>
      </div>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, title, content }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
      <h4 className="font-medium mb-2 flex items-center">
        <Icon className="h-4 w-4 mr-2 text-blue-500" />
        {title}
      </h4>
      <p className="text-sm">{content}</p>
    </div>
  );
}

export default ReservaDetails;
