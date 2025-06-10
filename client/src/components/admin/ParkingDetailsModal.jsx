import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Calendar, Users, Car, Clock, Plus, Edit2, Trash2, Building, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParking } from "@/hooks/useParking"
import { useReserva } from "@/hooks/useReserva"
import AnuncioFormModal from "./AnuncioFormModal"
import { toast } from "sonner"
import { formatDate, formatTime } from "@/lib/utils"

function ParkingDetailsModal({ isOpen, onClose, parking, onEdit }) {
  const {
    deleteAnuncio,
    fetchReservasParking,
    fetchReservasRapidasParking,
    fetchEventos,
    fetchAnuncios
  } = useParking()
  const { deleteReserva } = useReserva()

  const [reservas, setReservas] = useState([])
  const [reservasRapidas, setReservasRapidas] = useState([])
  const [eventos, setEventos] = useState([])
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnuncioModalOpen, setIsAnuncioModalOpen] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState(null)

  const loadParkingData = useCallback(async () => {
    if (!parking?.id) return

    try {
      setLoading(true)

      const [reservasData, rapidasData, eventosData, anunciosData] = await Promise.all([
        fetchReservasParking(parking.id),
        fetchReservasRapidasParking(parking.id),
        fetchEventos(parking.id),
        fetchAnuncios(parking.id)
      ])

      setReservas(reservasData || [])
      setReservasRapidas(rapidasData || [])
      setEventos(eventosData || [])
      setAnuncios(anunciosData || [])
    } catch (error) {
      console.error('Error loading parking data:', error)
      toast.error('Error al cargar los datos del parking')
    } finally {
      setLoading(false)
    }
  }, [parking?.id, fetchReservasParking, fetchReservasRapidasParking, fetchEventos, fetchAnuncios])

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
      toast.error('Error al eliminar la reserva')
    }
  }

  const handleDeleteAnuncio = async (anuncioId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return

    try {
      await deleteAnuncio(parking.id, anuncioId)
      toast.success('Anuncio eliminado correctamente')
      loadParkingData()
    } catch (error) {
      console.error('Error deleting anuncio:', error)
      toast.error('Error al eliminar el anuncio')
    }
  }

  const handleEditAnuncio = (anuncio) => {
    setEditingAnuncio(anuncio)
    setIsAnuncioModalOpen(true)
  }

  const handleAnuncioModalClose = () => {
    setIsAnuncioModalOpen(false)
    setEditingAnuncio(null)
  }

  const handleAnuncioUpdated = () => {
    loadParkingData()
    handleAnuncioModalClose()
  }

  const totalPlazas = parking?.plantas?.reduce((total, planta) => total + (planta.plazas?.length || 0), 0) || 0
  const ocupadas = parking?.plantas?.reduce((total, planta) =>
    total + (planta.plazas?.filter(plaza => plaza.ocupada)?.length || 0), 0) || 0

  if (!isOpen || !parking) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {parking.nombre}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{parking.direccion}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="reservas">Reservas</TabsTrigger>
                <TabsTrigger value="rapidas">Rápidas</TabsTrigger>
                <TabsTrigger value="anuncios">Anuncios</TabsTrigger>
                <TabsTrigger value="eventos">Eventos</TabsTrigger>
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
                          <p className="text-2xl font-bold">{reservas.length}</p>
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
                  <h3 className="text-lg font-semibold">Reservas Normales</h3>
                  <Badge variant="secondary">{reservas.length} total</Badge>
                </div>

                {reservas.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No hay reservas activas</p>
                    </CardContent>
                  </Card>
                ) : (
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
                )}
              </TabsContent>

              <TabsContent value="rapidas" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Reservas Rápidas</h3>
                  <Badge variant="secondary">{reservasRapidas.length} total</Badge>
                </div>

                {reservasRapidas.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No hay reservas rápidas</p>
                    </CardContent>
                  </Card>
                ) : (
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
                )}
              </TabsContent>

              <TabsContent value="anuncios" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Anuncios del Parking</h3>
                  <Button onClick={() => setIsAnuncioModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Anuncio
                  </Button>
                </div>

                {anuncios.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No hay anuncios publicados</p>
                      <Button onClick={() => setIsAnuncioModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Anuncio
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {anuncios.map((anuncio) => (
                      <Card key={anuncio._id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={anuncio.activo ? "default" : "secondary"}>
                                  {anuncio.activo ? "Activo" : "Inactivo"}
                                </Badge>
                                <Badge variant="outline" className={`${
                                  anuncio.tipo === 'informativo' ? 'text-blue-600 border-blue-600' :
                                    anuncio.tipo === 'promocion' ? 'text-green-600 border-green-600' :
                                      'text-orange-600 border-orange-600'
                                }`}>
                                  {anuncio.tipo}
                                </Badge>
                              </div>
                              <h4 className="font-medium">{anuncio.titulo}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{anuncio.descripcion}</p>
                              <div className="text-xs text-gray-500">
                                Creado: {formatDate(anuncio.fechaCreacion)}
                                {anuncio.fechaExpiracion && (
                                  <span> • Expira: {formatDate(anuncio.fechaExpiracion)}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAnuncio(anuncio)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAnuncio(anuncio._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="eventos" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Eventos del Sistema</h3>
                  <Badge variant="secondary">{eventos.length} total</Badge>
                </div>

                {eventos.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No hay eventos registrados</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {eventos.map((evento) => (
                      <Card key={evento._id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant={evento.tipo === 'entrada' ? 'default' : 'secondary'}>
                                  {evento.tipo}
                                </Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Plaza {evento.plaza?.numero} - {evento.planta?.nombre}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {evento.descripcion}
                              </p>
                              <div className="text-xs text-gray-500">
                                {formatDate(evento.fecha)} - {formatTime(evento.fecha)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>        <AnuncioFormModal
          isOpen={isAnuncioModalOpen}
          onClose={handleAnuncioModalClose}
          parkingId={parking?.id}
          anuncio={editingAnuncio}
          onSuccess={handleAnuncioUpdated}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ParkingDetailsModal
