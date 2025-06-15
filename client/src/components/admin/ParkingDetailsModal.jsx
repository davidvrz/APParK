import { useState, useEffect, useCallback } from "react"
import { MapPin, Calendar, Users, Car, Edit2, Trash2, Building } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParking } from "@/hooks/useParking"
import { useReserva } from "@/hooks/useReserva"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/utils"

function ParkingDetailsModal({ isOpen, onClose, parking, onEdit }) {
  const {
    fetchReservasParking,
    fetchReservasRapidasParking,
  } = useParking()

  const { deleteReserva } = useReserva()
  const [reservas, setReservas] = useState([])
  const [reservasRapidas, setReservasRapidas] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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
    if (!confirm('¿Estás seguro de que quieres eliminar esta reserva?')) return

    try {
      await deleteReserva(reservaId)
      toast.success('Reserva eliminada correctamente')
      loadParkingData()
    } catch (error) {
      console.error('Error deleting reserva:', error)
    }
  }

  const totalPlazas = parking?.plantas?.reduce((total, planta) => total + (planta.plazas?.length || 0), 0) || 0
  const ocupadas = parking?.plantas?.reduce((total, planta) =>
    total + (planta.plazas?.filter(plaza => plaza.ocupada)?.length || 0), 0) || 0

  if (!parking) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Plantas</p>
                          <p className="text-2xl font-bold">{parking.plantas?.length || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Plazas</p>
                          <p className="text-2xl font-bold">{totalPlazas}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ocupadas</p>
                          <p className="text-2xl font-bold">{ocupadas}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reservas</p>
                          <p className="text-2xl font-bold">{reservas.length + reservasRapidas.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plantas Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estructura del Parking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {parking.plantas?.map((planta) => (
                        <div key={planta._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold">{planta.nombre}</h4>
                            <Badge variant="outline">
                              {planta.plazas?.length || 0} plazas
                            </Badge>
                          </div>
                          <div className="grid grid-cols-8 gap-2">
                            {planta.plazas?.map((plaza) => (
                              <div
                                key={plaza._id}
                                className={`p-2 rounded text-center text-sm ${
                                  plaza.ocupada
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}
                              >
                                {plaza.numero}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservas" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Todas las Reservas</h3>
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
                            <Card key={reserva._id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant={reserva.activa ? "default" : "secondary"}>
                                        {reserva.activa ? "Activa" : "Finalizada"}
                                      </Badge>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Plaza {reserva.plaza?.numero} - {reserva.planta?.nombre}
                                      </span>
                                    </div>
                                    <p className="font-medium">{reserva.usuario?.nombre} {reserva.usuario?.apellidos}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                      <span>📧 {reserva.usuario?.email}</span>
                                      <span>🕒 {formatDate(reserva.fechaReserva)} - {formatTime(reserva.horaInicio)}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteReserva(reserva._id)}
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
                            <Card key={reserva._id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                                        Rápida
                                      </Badge>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {reserva.completada ? 'Completada' : 'En progreso'}
                                      </span>
                                    </div>
                                    <p className="font-medium">{reserva.usuario?.nombre} {reserva.usuario?.apellidos}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                      <span>📧 {reserva.usuario?.email}</span>
                                      <span>🕒 {formatDate(reserva.fechaCreacion)}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteReserva(reserva._id)}
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ParkingDetailsModal
