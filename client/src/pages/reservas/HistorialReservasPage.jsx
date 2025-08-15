import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Clock, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useReserva } from "@/hooks/useReserva"
import { Input } from "@/components/ui/Input"
import { Link } from "react-router-dom"
import ReservaHistorialCard from "@/components/dashboard/ReservaHistorialCard"

const ITEMS_PER_PAGE = 9

export default function HistorialReservasPage() {
  const { historial = [], loading } = useReserva()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredReservas = historial.filter(reserva => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      reserva.parking?.nombre?.toLowerCase().includes(searchLower) ||
      reserva.parking?.ubicacion?.toLowerCase().includes(searchLower) ||
      reserva.plaza?.numero?.toString().toLowerCase().includes(searchLower) ||
      reserva.vehicle?.matricula?.toLowerCase().includes(searchLower) ||
      reserva.vehicle?.modelo?.toLowerCase().includes(searchLower) ||
      reserva.estado?.toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredReservas.length / ITEMS_PER_PAGE)
  const paginatedReservas = filteredReservas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Historial de Reservas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Consulta todas tus reservas pasadas.
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
              placeholder="Buscar en historial..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      </div>

      <Card className="border-2 border-blue-200 dark:border-blue-900/30 shadow-sm bg-white dark:bg-gray-800/60">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="font-display text-xl font-semibold tracking-tight">
              {searchTerm ? 'Resultados de Búsqueda' : 'Historial Completo'}
            </CardTitle>
            <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 font-medium">
              <span className="sm:hidden">{filteredReservas.length}</span>
              <span className="hidden sm:inline">{filteredReservas.length} Reservas</span>
            </Badge>
          </div>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? `Mostrando ${paginatedReservas.length} de ${filteredReservas.length} reservas encontradas.`
              : `Página ${currentPage} de ${totalPages}. Total: ${filteredReservas.length} reservas.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {loading && filteredReservas.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
            </div>
          ) : !loading && filteredReservas.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedReservas.map((reserva) => (
                  <ReservaHistorialCard key={reserva.id} reservation={reserva} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}