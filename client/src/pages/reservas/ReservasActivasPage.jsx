import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Search, AlertCircle } from "lucide-react"

import { useReserva } from "@/hooks/useReserva"
import ReservasActivas from "@/components/dashboard/ReservasActivas"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ReservasActivasPage() {
  const { reservas = [], loading, error, clearError } = useReserva()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReservas = reservas.filter(reserva => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()

    return (
      reserva.parking?.nombre?.toLowerCase().includes(searchLower) ||
      reserva.parking?.ubicacion?.toLowerCase().includes(searchLower) ||
      reserva.plaza?.numero?.toString().toLowerCase().includes(searchLower) ||
      reserva.vehiculo?.matricula?.toLowerCase().includes(searchLower) ||
      reserva.vehiculo?.modelo?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Mis Reservas Activas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestiona todas tus reservas de aparcamiento actuales
          </p>
        </div>

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

      <Card className="bg-gray-100 dark:bg-gray-800/90 border-none shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-display text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                Reservas Activas
              </CardTitle>
              <CardDescription className="font-normal text-gray-500 dark:text-gray-400 mt-1">
                {searchTerm ? 'Resultados de la búsqueda' : 'Todas tus reservas activas'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 font-medium">
              <span className="sm:hidden">{filteredReservas.length}</span>
              <span className="hidden sm:inline">{filteredReservas.length} Reservas</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error al Cargar Reservas</AlertTitle>
              <AlertDescription>
                {typeof error === 'string' ? error : JSON.stringify(error)}
                <Button variant="link" onClick={() => clearError && clearError()} className="p-0 h-auto ml-2">Reintentar</Button>
              </AlertDescription>
            </Alert>
          )}
          {!error && loading && filteredReservas.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
            </div>
          ) : !error && !loading && filteredReservas.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center px-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-display font-medium tracking-tight mb-2">
                {searchTerm ? 'No hay resultados para tu búsqueda' : 'No tienes reservas activas'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-normal">
                {searchTerm
                  ? 'Prueba con otros términos de búsqueda.'
                  : 'Cuando realices una reserva, aparecerá aquí.'}
              </p>
              {!searchTerm && (
                <Link to="/map">
                  <Button className="mt-4">
                    Crear Reserva
                  </Button>
                </Link>
              )}
            </div>
          ) : !error && (
            <ReservasActivas
              reservas={filteredReservas}
              isLoading={loading}
              isEmbedded={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}