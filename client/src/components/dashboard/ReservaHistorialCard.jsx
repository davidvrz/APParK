import { Card, CardContent } from "@/components/ui/Card"
import { Clock, MapPin, Car, Calendar, Layers, Square, CheckCircle } from "lucide-react"
import { formatTime, formatDate } from "@/lib/utils"

export default function ReservaHistorialCard({ reservation }) {
  return (
    <Card className="p-2 overflow-hidden border shadow-md bg-white dark:bg-gray-800 h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100">
              {reservation.parking?.nombre || "Parking"}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
              <span className="font-normal">{reservation.parking?.ubicacion || "Ubicación no disponible"}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100">
              {reservation.precioTotal ? `${reservation.precioTotal}€` : "Precio N/D"}
            </div>
            {reservation.estado && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <CheckCircle className={`h-4 w-4 ${
                  reservation.estado === 'completada' ? 'text-green-500' :
                    reservation.estado === 'cancelada' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <span className={`text-xs font-medium ${
                  reservation.estado === 'completada' ? 'text-green-600 dark:text-green-400' :
                    reservation.estado === 'cancelada' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {reservation.estado.charAt(0).toUpperCase() + reservation.estado.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
          {/* Vehículo */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
            <Car className="h-6 w-6 mb-1 text-blue-500" />
            <p className="text-base font-medium text-center leading-tight">{reservation.vehicle?.matricula || "Matrícula N/D"}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 text-center leading-tight">
              {reservation.vehicle?.modelo || "Modelo N/D"}
            </p>
          </div>

          {/* Ubicación */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Square className="h-5 w-5 mb-0.5 text-blue-500" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Plaza</span>
                <p className="text-base font-medium leading-tight">{reservation.plaza?.numero || "N/D"}</p>
              </div>
              <div className="flex flex-col items-center">
                <Layers className="h-5 w-5 mb-0.5 text-blue-500" />
                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Planta</span>
                <p className="text-base font-medium leading-tight">P{reservation.planta?.numero || reservation.plaza?.planta?.numero || "N/D"}</p>
              </div>
            </div>
          </div>

          {/* Entrada */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 mb-0.5 text-blue-500" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">Entrada</span>
            <p className="text-base font-medium leading-tight">{formatTime(reservation.startTime)}</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatDate(reservation.startTime)}</p>
            </div>
          </div>

          {/* Salida */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 mb-0.5 text-blue-500" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">Salida</span>
            <p className="text-base font-medium leading-tight">{formatTime(reservation.endTime)}</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatDate(reservation.endTime)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
