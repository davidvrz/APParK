import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Clock, MapPin, Car, Calendar, Search, ArrowLeft, Layers, Square } from "lucide-react"
import { useReservas } from "@/hooks/useReservas"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Input } from "@/components/ui/Input"
import { Link } from "react-router-dom"

function formatTime(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "HH:mm", { locale: es })
}

function formatShortDate(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "d MMM yyyy", { locale: es })
}

function ReservaHistoricaCard({ reservation }) {
  return (
    <Card className="overflow-hidden border shadow-md bg-white dark:bg-gray-800 h-full">
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
          </div>
        </div><div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
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
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatShortDate(reservation.startTime)}</p>
            </div>
          </div>

          {/* Salida */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 mb-0.5 text-blue-500" />
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">Salida</span>
            <p className="text-base font-medium leading-tight">{formatTime(reservation.endTime)}</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatShortDate(reservation.endTime)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HistorialReservasPage() {
  const { historial = [] } = useReservas()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReservas = historial.filter(reserva => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()

    return (
      reserva.parking?.nombre?.toLowerCase().includes(searchLower) ||
      reserva.parking?.ubicacion?.toLowerCase().includes(searchLower) ||
      reserva.plaza?.numero?.toString().includes(searchLower) ||
      reserva.vehicle?.matricula?.toLowerCase().includes(searchLower) ||
      reserva.vehicle?.modelo?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-2 w-full md:w-auto">
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>

          <div className="relative flex-1 md:w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar reservas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="border-2 border-blue-200 dark:border-blue-900/30 shadow-sm bg-white dark:bg-gray-800/60">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="font-display text-xl font-semibold tracking-tight">Historial Completo</CardTitle>
            <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 font-medium">
              {filteredReservas.length} Reservas
            </Badge>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Resultados de la búsqueda' : 'Todas tus reservas completadas ordenadas por fecha'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {filteredReservas.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center px-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-display font-medium tracking-tight mb-2">
                {searchTerm ? 'No hay resultados para tu búsqueda' : 'Aún no tienes reservas pasadas'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-normal">
                {searchTerm
                  ? 'Prueba con otros términos de búsqueda'
                  : 'Cuando realices una reserva y se complete, aparecerá aquí tu historial.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReservas.map((reserva) => (
                <ReservaHistoricaCard key={reserva.id} reservation={reserva} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}