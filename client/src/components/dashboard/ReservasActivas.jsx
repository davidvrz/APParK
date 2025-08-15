import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { AlertCircle, Search } from "lucide-react"
import { Link } from "react-router-dom"

import ReservaCard from "./ReservaCard"
import ReservaDetails from "./ReservaDetails"
import ReservaEditForm from "./ReservaEditForm"
import NewReservaCard from "./NewReservaCard"

import { useReserva } from "@/hooks/useReserva"
import { useVehiculos } from "@/hooks/useVehiculos"
import { useParking } from "@/hooks/useParking"

export default function ReservasActivas({ searchTerm = "", isEmbedded = false, }) {
  const {
    reservas,
    loading,
    error,
    cancelarReserva,
    modificarReserva,
    clearError
  } = useReserva()

  // Filtrar reservas según el término de búsqueda
  const filteredReservas = useMemo(() => {
    if (!searchTerm) return reservas

    const searchLower = searchTerm.toLowerCase()

    // Helper function for safe searching
    const safeTextIncludes = (text, term) => {
      if (text === null || typeof text === 'undefined') {
        return false
      }
      return text.toString().toLowerCase().includes(term)
    }

    return reservas.filter(reserva => (
      safeTextIncludes(reserva.parking?.nombre, searchLower) ||
      safeTextIncludes(reserva.parking?.ubicacion, searchLower) ||
      safeTextIncludes(reserva.plaza?.numero, searchLower) ||
      safeTextIncludes(reserva.vehicle?.matricula, searchLower) ||
      safeTextIncludes(reserva.vehicle?.modelo, searchLower)
    ))
  }, [reservas, searchTerm])

  const [expandedId, setExpandedId] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const { vehiculos } = useVehiculos()
  const { parking } = useParking(selectedReservation?.parking?.id)

  // Usar la lista correcta según el contexto
  const displayReservas = isEmbedded ? filteredReservas : reservas
  const expandedReservation = (displayReservas || []).find((r) => r.id === expandedId)
  const isExpanded = !!expandedId

  let itemsToRender
  if (isEmbedded) {
    itemsToRender = filteredReservas || []
  } else {
    // En el dashboard, usar reservas originales
    const dashboardReservas = reservas || []
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Reservas</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" onClick={() => clearError && clearError()} className="p-0 h-auto ml-2">Reintentar</Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && loading ? (
        <div className="h-56 flex items-center justify-center">
          <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
        </div>
      ) : !error && !loading && isEmbedded && filteredReservas.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center px-8">
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-display font-medium">Error</AlertTitle>
              <AlertDescription className="font-normal">{error}</AlertDescription>
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
              apiError={error}
              isLoading={loading || editLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
  if (isEmbedded) {
    return (
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
          {reservationsContent}
        </CardContent>
      </Card>
    )
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
            {(reservas || []).length > 3 && !isExpanded && (
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
              <span className="sm:hidden">{(reservas || []).length}</span>
              <span className="hidden sm:inline">{(reservas || []).length} Reservas</span>
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
