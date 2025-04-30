import { useState } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Card,  CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { AlertCircle, Car, ExternalLink } from "lucide-react"
import ReservaCard from "./ReservaCard"
import ReservaDetails from "./ReservaDetails"
import ReservaEditForm from "@/components/dashboard/ReservaEditForm"
import { useReservas } from "@/hooks/useReservas"
import { cancelarReserva as apiCancelarReserva, modificarReserva } from "@/api/reservas"

function ReservasActivas() {
  const { reservas = [], loading, refetch } = useReservas()
  const [expandedId, setExpandedId] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const expandedReservation = reservas.find((r) => r.id === expandedId)

  const handleCancelReservation = async () => {
    if (!selectedReservation) return

    try {
      await apiCancelarReserva(selectedReservation.id)
      await refetch()
    } catch (err) {
      console.error("Error al cancelar reserva:", err)
    } finally {
      setCancelOpen(false)
      if (expandedId === selectedReservation.id) setExpandedId(null)
      setSelectedReservation(null)
    }
  }

  const handleSaveReserva = async (updatedData) => {
    try {
      await modificarReserva(updatedData.id, updatedData)
      await refetch()
    } catch (err) {
      console.error("Error al modificar reserva:", err)
    } finally {
      setEditOpen(false)
      setSelectedReservation(null)
    }
  }

  return (
    <LayoutGroup>
      <Card className={`min-h-[500px] h-full overflow-hidden bg-white/80 backdrop-blur-sm border-none shadow-lg dark:bg-gray-800/60 transition-all duration-300 ${expandedId ? "z-10" : ""}`}>
        <motion.div layout>
          <CardHeader className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle>Reservas Activas</CardTitle>
              <Badge variant="outline" className="text-white border-white">{reservas.length} Activas</Badge>
            </div>
            <CardDescription className="text-blue-100">Tus reservas de estacionamiento actuales</CardDescription>
          </CardHeader>
        </motion.div>

        <motion.div layout className="flex-grow overflow-y-auto">
          <CardContent className="p-0 h-full">
            <AnimatePresence mode="wait">
              {expandedReservation ? (
                <ReservaDetails
                  reservation={expandedReservation}
                  onClose={() => setExpandedId(null)}
                  onCancel={() => {
                    setSelectedReservation(expandedReservation)
                    setCancelOpen(true)
                  }}
                />
              ) : (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="divide-y">
                  {reservas.map((reserva) => (
                    <ReservaCard
                      key={reserva.id}
                      reservation={reserva}
                      onExpand={() => setExpandedId(reserva.id)}
                      onViewDetails={(e) => {
                        e.stopPropagation()
                        setSelectedReservation(reserva)
                        setDetailsOpen(true)
                      }}
                      onEdit={(e) => {
                        e.stopPropagation()
                        setSelectedReservation(reserva)
                        setEditOpen(true)
                      }}
                      onCancel={(e) => {
                        e.stopPropagation()
                        setSelectedReservation(reserva)
                        setCancelOpen(true)
                      }}
                    />
                  ))}

                  {!loading && reservas.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No tienes reservas activas</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Crea una nueva reserva para ver tus estacionamientos activos aquí
                      </p>
                      <Button>Crear Reserva</Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </motion.div>

        {!expandedReservation && reservas.length > 0 && (
          <motion.div layout>
            <CardFooter className="flex justify-center py-3 border-t">
              <Button variant="ghost" className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent font-medium">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver todas las reservas
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </Card>

      {/* Diálogo de detalles */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de Reserva</DialogTitle>
            <DialogDescription>Información completa de tu reserva</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{selectedReservation.parking?.nombre || "Parking"}</h3>
                <p className="text-sm text-gray-500">{selectedReservation.parking?.ubicacion || "Ubicación desconocida"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm">Plaza {selectedReservation.plaza?.numero || "N/A"} ({selectedReservation.plaza?.tipo || "N/A"})</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de cancelación */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              Cancelar Reserva
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
              <h3 className="font-medium">{selectedReservation.parking?.nombre || "Parking"}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReservation.plaza?.tipo} - Plaza {selectedReservation.plaza?.numero}</p>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Volver</Button>
            <Button variant="destructive" onClick={handleCancelReservation}>Confirmar Cancelación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modificar Reserva</DialogTitle>
            <DialogDescription>Cambia la plaza, vehículo u horario de esta reserva</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <ReservaEditForm
              reserva={selectedReservation}
              onCancel={() => {
                setEditOpen(false)
                setSelectedReservation(null)
              }}
              onSave={handleSaveReserva}
            />
          )}
        </DialogContent>
      </Dialog>
    </LayoutGroup>
  )
}

export default ReservasActivas
