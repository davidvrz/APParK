import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

import ReservaCard from "./ReservaCard"
import ReservaDetails from "./ReservaDetails"
import ReservaEditForm from "./ReservaEditForm"
import NewReservaCard from "./NewReservaCard"

import { useReserva } from "@/hooks/useReserva"
import { useVehiculos } from "@/hooks/useVehiculos"
import { useParking } from "@/hooks/useParking"

export default function ReservasActivas({
  reservas: propReservas,
  isLoading: propIsLoading,
  isEmbedded = false,
}) {
  const {
    reservas: hookReservas,
    loading: hookLoading,
    error: actionError,
    cancelarReserva,
    modificarReserva,
    clearError
  } = useReserva()

  const currentReservas = isEmbedded ? propReservas : hookReservas
  const currentLoading = isEmbedded ? propIsLoading : hookLoading

  const [expandedId, setExpandedId] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const { vehiculos } = useVehiculos()
  const { parking } = useParking(selectedReservation?.parking?.id)

  const expandedReservation = (currentReservas || []).find((r) => r.id === expandedId)
  const isExpanded = !!expandedId

  let itemsToRender
  if (isEmbedded) {
    itemsToRender = currentReservas || []
  } else {
    const dashboardReservas = currentReservas || []
    itemsToRender = [...dashboardReservas.slice(0, 3)]
    if (dashboardReservas.length < 3) {
      while (itemsToRender.length < 3) {
        itemsToRender.push(null)
      }
    }
  }

  const handleCancel = async () => {
    if (!selectedReservation) return
    try {
      await cancelarReserva(selectedReservation.id)
      setCancelOpen(false)
      if (expandedId === selectedReservation.id) setExpandedId(null)
      setSelectedReservation(null)
    } catch (error) {
      console.error('Error al cancelar reserva:', error)
    }
  }

  const handleSave = async (formData) => {
    if (!selectedReservation) return false
    setEditLoading(true)
    try {
      const payload = {
        vehicleId: Number(formData.vehicleId),
        plazaId: Number(formData.plazaId),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      }
      await modificarReserva(selectedReservation.id, payload)
      setTimeout(() => {
        setEditOpen(false)
      }, 1500)
      return true
    } catch (err) {
      console.error('Error al modificar reserva:', err)
      return false
    } finally {
      setEditLoading(false)
    }
  }

  useEffect(() => {
    if (!editOpen && !cancelOpen) {
      setSelectedReservation(null)
      clearError()
    }
  }, [editOpen, cancelOpen, clearError])

  const reservationsContent = (
    <>
      {currentLoading ? (
        <div className="h-56 flex items-center justify-center">
          <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded && expandedReservation ? (
            <motion.div
              key="expanded-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="rounded-xl"
            >
              <ReservaDetails
                reservation={expandedReservation}
                onClose={() => setExpandedId(null)}
                onDelete={() => {
                  setSelectedReservation(expandedReservation)
                  setCancelOpen(true)
                }}
                onEdit={() => {
                  setSelectedReservation(expandedReservation)
                  setEditOpen(true)
                }}
              />
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
              {itemsToRender.map((reserva, index) => (
                <div
                  key={reserva ? reserva.id : `empty-${index}-${isEmbedded}`}
                  className="rounded-xl shadow-sm h-full"
                >
                  {reserva ? (
                    <ReservaCard
                      reservation={reserva}
                      onExpand={() => setExpandedId(reserva.id)}
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
                  ) : (
                    !isEmbedded && <NewReservaCard />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

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
          {actionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-display font-medium">Error</AlertTitle>
              <AlertDescription className="font-normal">{actionError}</AlertDescription>
            </Alert>
          )}
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
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
              parking={parking}
              onCancel={() => setEditOpen(false)}
              onSave={handleSave}
              apiError={actionError}
              isLoading={hookLoading || editLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )

  if (isEmbedded) {
    return reservationsContent
  }

  return (
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
            {(currentReservas || []).length > 3 && !isExpanded && (
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
              <span className="sm:hidden">{(currentReservas || []).length}</span>
              <span className="hidden sm:inline">{(currentReservas || []).length} Reservas</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {reservationsContent}
      </CardContent>
    </Card>
  )
}
