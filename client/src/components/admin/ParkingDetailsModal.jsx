import { useState, useEffect, useCallback } from "react"
import { MapPin, Calendar, Users, Car, Edit2, Trash2, Building, Clock, Timer, Map, Navigation, Activity, CalendarCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useReserva } from "@/hooks/useReserva"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/utils"

function ParkingDetailsModal({ isOpen, onClose, parking, onEdit }) {
  const {
    fetchReservasParking,
    fetchReservasRapidasParking,
    eliminarReserva
  } = useReserva()

  const [reservas, setReservas] = useState([])
  const [reservasRapidas, setReservasRapidas] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, reservaId: null })

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab)
  }, [])

  const loadParkingData = useCallback(async () => {
    if (!parking?.id) return

    try {
      setLoading(true)

      const [reservasData, rapidasData] = await Promise.all([
        fetchReservasParking(parking.id),
        fetchReservasRapidasParking(parking.id),
      ])

      setReservas(reservasData || [])
      setReservasRapidas(rapidasData || [])
    } catch (error) {
      console.error('Error loading parking data:', error)
      toast.error('Error al cargar los datos del parking')
    } finally {
      setLoading(false)
    }
  }, [parking?.id, fetchReservasParking, fetchReservasRapidasParking])

  useEffect(() => {
    if (isOpen && parking) {
      loadParkingData()
    }
  }, [isOpen, parking, loadParkingData])

  const handleDeleteReserva = async (reservaId) => {
    setDeleteConfirm({ isOpen: true, reservaId })
  }

  const confirmDeleteReserva = async () => {
    const { reservaId } = deleteConfirm

    try {
      await eliminarReserva(reservaId)
      toast.success('Reserva eliminada correctamente')
      loadParkingData()
    } catch (error) {
      console.error('Error deleting reserva:', error)
      toast.error('Error al eliminar la reserva')
    } finally {
      setDeleteConfirm({ isOpen: false, reservaId: null })
    }
  }
  const totalPlazas = parking?.capacidad || 0
  const plazasLibres = parking?.plazasLibres || 0
  const plazasOcupadas = parking?.plazasOcupadas || 0
  const plazasReservadas = parking?.plazasReservadas || 0

  if (!parking) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parking.nombre}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{parking.ubicacion || 'Ubicación no disponible'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="reservas">Reservas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                {/* Información General */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{parking.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacidad:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{parking.capacidad} plazas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                          <Badge variant={parking.estado === 'Operativo' ? 'default' : 'secondary'}>
                            {parking.estado}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latitud:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{parking.latitud}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Longitud:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{parking.longitud}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plantas:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{parking.plantas?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas de Ocupación */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Estado de Ocupación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{plazasLibres}</div>
                        <div className="text-sm text-green-700 dark:text-green-300">Libres</div>
                      </div>
                      <div className="text-center p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{plazasOcupadas}</div>
                        <div className="text-sm text-red-700 dark:text-red-300">Ocupadas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{plazasReservadas}</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">Reservadas</div>
                      </div>
                      <div className="text-center p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPlazas}</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
                      </div>
                    </div>

                    {/* Barra de progreso de ocupación */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ocupación del parking</span>
                        <span>{Math.round(((plazasOcupadas + plazasReservadas) / totalPlazas) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="flex h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500"
                            style={{ width: `${(plazasOcupadas / totalPlazas) * 100}%` }}
                          />
                          <div
                            className="bg-yellow-500"
                            style={{ width: `${(plazasReservadas / totalPlazas) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Ocupadas: {plazasOcupadas}</span>
                        <span>Reservadas: {plazasReservadas}</span>
                        <span>Libres: {plazasLibres}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Estructura del Parking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Estructura del Parking - Plantas y Plazas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {parking.plantas?.map((planta) => (
                        <div key={planta.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">Planta {planta.numero}</h4>
                            <div className="flex gap-2">
                              <Badge variant="outline">
                                {planta.plazas?.length || 0} plazas
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                            {planta.plazas?.map((plaza) => (
                              <div
                                key={plaza.id}
                                className={`p-2 rounded text-center text-xs border ${
                                  plaza.estado === 'Libre'
                                    ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                                    : plaza.estado === 'Ocupado'
                                      ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                                      : 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                                }`}
                              >
                                <div className="font-semibold">{plaza.numero}</div>
                                <div className="text-xs opacity-75 truncate" title={plaza.tipo}>
                                  {plaza.tipo || 'Normal'}
                                </div>
                                <div className="text-xs opacity-75">€{plaza.precioHora}</div>
                                {plaza.reservable && (
                                  <div className="text-xs text-blue-600 dark:text-blue-400">
                                    <CalendarCheck className="h-3 w-3 mx-auto" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-500 rounded"></div>
                              Libre
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              Ocupado
                            </span>
                            <span className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                              Reservado
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarCheck className="h-3 w-3" />
                              Reservable
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservas" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Reservas Activas</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{reservas.length} normales</Badge>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {reservasRapidas.length} rápidas
                    </Badge>
                  </div>
                </div>

                {reservas.length === 0 && reservasRapidas.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No hay reservas activas</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Reservas Normales */}
                    {reservas.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Reservas Normales ({reservas.length})
                        </h4>
                        <div className="space-y-3">
                          {reservas.map((reserva) => (
                            <Card key={reserva.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="default">
                                        Reserva Normal
                                      </Badge>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Plaza {reserva.plaza?.numero} - Planta {reserva.planta?.numero}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDate(reserva.startTime)} - {formatTime(reserva.startTime)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Timer className="h-3 w-3" />
                                        <span>Hasta: {formatTime(reserva.endTime)}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Tipo: {reserva.plaza?.tipo}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteReserva(reserva.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reservas Rápidas */}
                    {reservasRapidas.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
                          Reservas Rápidas ({reservasRapidas.length})
                        </h4>
                        <div className="space-y-3">
                          {reservasRapidas.map((reserva) => (
                            <Card key={reserva.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                                        Reserva Rápida
                                      </Badge>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Plaza {reserva.plaza?.numero} - Planta {reserva.planta?.numero}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Car className="h-3 w-3" />
                                        <span>{reserva.matricula}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatDate(reserva.startTime)} - {formatTime(reserva.startTime)}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Tipo: {reserva.plaza?.tipo}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && setDeleteConfirm({ isOpen: false, reservaId: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300">
              ¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ isOpen: false, reservaId: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteReserva}
            >
              Eliminar reserva
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ParkingDetailsModal
