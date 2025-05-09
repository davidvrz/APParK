import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Clock, MapPin, Car, Calendar, Search, ArrowLeft } from "lucide-react"
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
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
              {reservation.parking?.nombre || "Parking"}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
              <span className="font-normal">{reservation.parking?.ubicacion || "Ubicación no disponible"}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">
              {reservation.precioTotal ? `${reservation.precioTotal}€` : "Precio N/D"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 font-medium mb-1">Entrada</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
              <span className="text-sm font-normal">{formatShortDate(reservation.startTime)}</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
              <span className="text-sm font-medium">{formatTime(reservation.startTime)}</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm text-gray-500 font-medium mb-1">Salida</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
              <span className="text-sm font-normal">{formatShortDate(reservation.endTime)}</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
              <span className="text-sm font-medium">{formatTime(reservation.endTime)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1.5 text-blue-500" />
                <span className="text-sm font-medium">{reservation.vehicle?.matricula || "Matrícula N/D"}</span>
              </div>
              <span className="text-xs text-gray-500 font-normal">
                {reservation.vehicle?.modelo || ""}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex-1">
            <p className="text-sm text-gray-500 font-medium mb-1">Ubicación</p>
            <div className="text-sm font-normal">
              Plaza {reservation.plaza?.numero || "N/D"} ·
              Planta {reservation.planta?.numero || reservation.plaza?.planta?.numero || "N/D"}
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