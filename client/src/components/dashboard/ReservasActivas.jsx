import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

import ReservaCard from "./ReservaCard"
import ReservaDetails from "./ReservaDetails"
import ReservaEditForm from "./ReservaEditForm"
import NewReservaCard from "./NewReservaCard"

import { useReservas } from "@/hooks/useReservas"
import { useVehiculos } from "@/hooks/useVehiculos"
import { useParking } from "@/hooks/useParking"

export default function ReservasActivas() {
  const {
    reservas,
    loading,
    error,
    cancelarReserva,
    modificarReserva,
    clearError
  } = useReservas()

  const [expandedId, setExpandedId] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const { vehiculos } = useVehiculos()
  const parkingId = selectedReservation?.parking?.id
  const { parking } = useParking(parkingId)

  const expandedReservation = reservas.find((r) => r.id === expandedId)
  const isExpanded = !!expandedId

  const reservasSlots = [...reservas.slice(0, 3)]
  while (reservasSlots.length < 3) {
    reservasSlots.push(null) // Los slots vacíos serán para crear reserva
  }

  const plazasDisponibles = parking?.plantas?.flatMap(planta => {
    return planta.plazas?.map(plaza => ({
      ...plaza,
      planta: {
        id: planta.id,
        numero: planta.numero,
        parking_id: planta.parking_id
      }
    })) || []
  }) || []

  const handleCancel = async () => {
    if (!selectedReservation) return
    await cancelarReserva(selectedReservation.id)
    setCancelOpen(false)
    if (expandedId === selectedReservation.id) setExpandedId(null)
    setSelectedReservation(null)
  }

  const handleSave = async (form) => {
    if (!selectedReservation) return
    clearError()
    setEditLoading(true)
    try {
      const payload = {
        vehicleId: Number(form.vehicleId),
        plazaId:   Number(form.plazaId),
        startTime: new Date(form.startTime).toISOString(),
        endTime:   new Date(form.endTime).toISOString()
      }
      await modificarReserva(selectedReservation.id, payload)
      setEditOpen(false)
      setSelectedReservation(null)
    } catch (err) {
    } finally {
      setEditLoading(false)
    }
  }

  const handleCloseEditDialog = () => {
    setEditOpen(false)
    setSelectedReservation(null)
    clearError()
  }
  return (
    <div>
      <Card className="bg-gray-100 dark:bg-gray-800/90 border-none shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-display text-xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">Mis Reservas</CardTitle>
              <CardDescription className="font-normal text-gray-500 dark:text-gray-400 mt-1">
                Gestiona tus reservas de aparcamiento actuales
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {reservas.length > 3 && !isExpanded && (
                <Link to="/reservas/activas">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-500 dark:text-blue-400 font-medium tracking-tight"
                  >
                    Ver completo
                  </Button>
                </Link>
              )}
              <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 font-medium">
                {reservas.length} Activas
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {isExpanded ? (
                <motion.div
                  key="expanded-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-xl"
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
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {reservasSlots.map((reserva, index) => (
                    <div
                      key={reserva ? reserva.id : `empty-${index}`}
                      className="rounded-xl shadow-sm h-full"
                    >
                      {reserva ? (
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
                      ) : (
                        <NewReservaCard />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* — Confirmación de cancelación — */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500 font-display tracking-tight">
              <AlertCircle className="h-5 w-5 mr-2" />
              Cancelar Reserva
            </DialogTitle>
            <DialogDescription className="font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas cancelar esta reserva?
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg mb-4">
              <h3 className="font-display font-medium tracking-tight text-gray-800 dark:text-gray-100">
                {selectedReservation.parking?.nombre || "Parking"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-normal">
                {selectedReservation.plaza?.tipo} – Plaza{" "}
                {selectedReservation.plaza?.numero}
              </p>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)} className="font-medium">
              Volver
            </Button>
            <Button variant="destructive" onClick={handleCancel} className="font-medium">
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* — Modificar reserva — */}
      <Dialog open={editOpen} onOpenChange={(isOpen) => {
        if (!isOpen) handleCloseEditDialog()
        else setEditOpen(true)
      }}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-100 font-display tracking-tight">Modificar Reserva</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 font-normal">
              Cambia plaza, vehículo u horario de esta reserva
            </DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <ReservaEditForm
              reserva={selectedReservation}
              vehiculos={vehiculos}
              plazasDisponibles={plazasDisponibles}
              onCancel={handleCloseEditDialog}
              onSave={handleSave}
              apiError={error}
              isLoading={loading || editLoading}
            />
          )}        </DialogContent>
      </Dialog>
    </div>
  )
}
