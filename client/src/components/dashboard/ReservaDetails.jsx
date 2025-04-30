import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {Clock,  MapPin,  Calendar,  Car,  Edit,  Trash2,  X,  Navigation,  Phone,  CreditCard,  Ticket,  ChevronUp,} from "lucide-react";
import { format } from "date-fns"
import { es } from "date-fns/locale"

function formatTime(dateString) {
  return format(new Date(dateString), "HH:mm", { locale: es });
}

function formatDate(dateString) {
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es });
}

function ReservaDetails({ reservation, onClose, onDelete }) {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    setActiveTab("details");
  }, [reservation.id]);

  const parkingName = reservation.parking?.nombre || "Parking desconocido";
  const parkingAddress = reservation.parking?.ubicacion || "Ubicación no disponible";
  const parkingSpot = reservation.plaza?.numero || "N/D";
  const floor = reservation.planta?.numero || "N/D";
  const carPlate = reservation.vehicle?.matricula || "Vehículo";
  const price = reservation.precioTotal ? `${reservation.precioTotal} €` : "Precio N/D";

  return (
    <motion.div
      key="expanded-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        {/* Tabs Header */}
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="details" className="flex-1">
            Detalles
          </TabsTrigger>
          <TabsTrigger value="map" className="flex-1">
            Mapa
          </TabsTrigger>
        </TabsList>

        {/* Tab Detalles */}
        <TabsContent value="details" className="p-4 flex-grow overflow-auto m-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Detalles de Reserva</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
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
              {/* Puedes añadir aquí más InfoCards si más tarde tienes campos como teléfono, método de pago... */}
            </div>

            {/* Precio final */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold flex items-center text-green-500">
                <Clock className="h-5 w-5 mr-2" />
                <span>Reserva Activa</span>
              </div>
              <div className="text-xl font-bold">{price}</div>
            </div>
          </div>
        </TabsContent>

        {/* Tab Mapa */}
        <TabsContent value="map" className="p-0 m-0 flex-grow">
          <div className="relative h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Mapa se cargaría aquí</p>

            <Button variant="secondary" size="sm" className="absolute bottom-4 right-4" onClick={() => setActiveTab("details")}>
              <X className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </TabsContent>
      </Tabs>

        {/* Minimizar */}
        <div className="flex justify-center mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full "
          >
            <ChevronUp className="h-5 w-5 text-gray-400" />
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
