import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Search, ArrowLeft } from "lucide-react"
import { useReservas } from "@/hooks/useReservas"
import { Input } from "@/components/ui/Input"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ReservaCard from "@/components/dashboard/ReservaCard"
import ReservaDetails from "@/components/dashboard/ReservaDetails"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import ReservaEditForm from "@/components/dashboard/ReservaEditForm"

const transitionConfig = {
  type: "spring",
  stiffness: 280,
  damping: 20,
}

export default function ReservasActivasPage() {
  const { reservas = [], cancelarReserva, modificarReserva } = useReservas()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [error, setError] = useState("")

  const filteredReservas = reservas.filter(reserva => {
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

  const handleCancelReserva = async () => {
    if (!selectedReservation) return

    try {
      await cancelarReserva(selectedReservation.id)
      setCancelOpen(false)
      setSelectedReservation(null)

      if (expandedId === selectedReservation.id) {
        setExpandedId(null)
      }
    } catch (err) {
      setError("No se pudo cancelar la reserva. Inténtalo de nuevo.")
    }
  }

  const handleEditSubmit = async (data) => {
    if (!selectedReservation) return

    try {
      await modificarReserva(selectedReservation.id, data)
      setEditOpen(false)
      setSelectedReservation(null)
    } catch (err) {
      setError("Error al actualizar la reserva. Inténtalo de nuevo.")
      return false
    }

    return true
  }

  const clearError = () => setError("")

  const expandedReservation = reservas.find(r => r.id === expandedId)

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
              {filteredReservas.length} Reservas
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredReservas.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center px-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-display font-medium tracking-tight mb-2">
                {searchTerm ? 'No hay resultados para tu búsqueda' : 'No tienes reservas activas'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-normal">
                {searchTerm
                  ? 'Prueba con otros términos de búsqueda'
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
          ) : (
            <AnimatePresence initial={false} mode="popLayout">
              {expandedId ? (
                <motion.div
                  key="expanded-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={transitionConfig}
                  layout
                  className="overflow-hidden rounded-xl"
                >
                  {expandedReservation && (
                    <ReservaDetails
                      reservation={expandedReservation}
                      onClose={() => setExpandedId(null)}
                      onDelete={() => {
                        setSelectedReservation(expandedReservation)
                        setCancelOpen(true)
                      }}
                      onEdit={() => {
                        clearError()
                        setSelectedReservation(expandedReservation)
                        setEditOpen(true)
                      }}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transitionConfig}
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredReservas.map((reserva) => (
                    <motion.div
                      key={reserva.id}
                      layout
                      className="rounded-xl overflow-hidden shadow-sm h-full"
                      transition={transitionConfig}
                    >
                      <ReservaCard
                        reservation={reserva}
                        onExpand={() => setExpandedId(reserva.id)}
                        onEdit={(e) => {
                          e.stopPropagation()
                          clearError()
                          setSelectedReservation(reserva)
                          setEditOpen(true)
                        }}
                        onCancel={(e) => {
                          e.stopPropagation()
                          setSelectedReservation(reserva)
                          setCancelOpen(true)
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de cancelación */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <CardHeader>
            <CardTitle>Cancelar Reserva</CardTitle>
            <CardDescription>
              ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.
            </CardDescription>
          </CardHeader>
          <div className="flex justify-end gap-3 px-6 pb-6">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Mantener Reserva
            </Button>
            <Button variant="destructive" onClick={handleCancelReserva}>
              Cancelar Reserva
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CardHeader>
            <CardTitle>Editar Reserva</CardTitle>
            <CardDescription>
              Modifica los detalles de tu reserva según necesites.
            </CardDescription>
          </CardHeader>
          {selectedReservation && (
            <ReservaEditForm
              reserva={selectedReservation}
              onSubmit={handleEditSubmit}
              error={error}
              onCancel={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}