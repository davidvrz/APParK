import { useState, useEffect } from 'react'
import { useParking } from '@/hooks/useParking'
import ReservationForm from './ReservationForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeftIcon, MapPinIcon, CarIcon, CalendarIcon, BellIcon, Loader2 } from 'lucide-react'

const ParkingDetails = ({ parking: parkingPreview, onClose }) => {
  const [activeTab, setActiveTab] = useState('info')
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [loadingAnuncios, setLoadingAnuncios] = useState(false)
  const { parking, anuncios, loading, error, fetchParkingById, fetchAnuncios } = useParking()

  useEffect(() => {
    // Fetch complete parking details when a parking is selected
    if (parkingPreview?.id) {
      fetchParkingById(parkingPreview.id)
    }
  }, [parkingPreview?.id, fetchParkingById])

  // Cargar anuncios cuando se selecciona la pestaña de anuncios
  useEffect(() => {
    if (activeTab === 'anuncios' && parking?.id && !loadingAnuncios) {
      setLoadingAnuncios(true)
      fetchAnuncios(parking.id).finally(() => setLoadingAnuncios(false))
    }
  }, [activeTab, parking?.id, loadingAnuncios, fetchAnuncios])

  const handleMakeReservation = () => {
    setActiveTab('plazas')
    setShowReservationForm(true)
  }

  const handleCancelReservation = () => {
    setShowReservationForm(false)
  }

  if (loading) {
    return (
      <Card className="h-full w-full overflow-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Cargando información del parking...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full w-full overflow-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error al cargar la información: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!parking) {
    return (
      <Card className="h-full w-full overflow-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>No se ha seleccionado ningún parking</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full w-full overflow-auto">
      <CardHeader className="bg-slate-50 sticky top-0 z-10">
        <div className="flex items-start">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 -ml-2 h-8 w-8"
            onClick={onClose}
            title="Volver al mapa"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>

          <div>
            <CardTitle className="text-xl">{parking.nombre}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPinIcon className="h-3.5 w-3.5 mr-1 text-slate-500" />
              {parking.ubicacion}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="plazas">Plazas disponibles</TabsTrigger>
              <TabsTrigger value="anuncios">
                Anuncios
                {anuncios.length > 0 && (
                  <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600 font-medium">
                    {anuncios.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="info" className="m-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-sm text-slate-500">Estado</p>
                    <p className="font-medium">{parking.estado}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-sm text-slate-500">Capacidad Total</p>
                    <p className="font-medium">{parking.capacidad} plazas</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-600">Plazas Libres</p>
                    <p className="font-medium">{parking.plazasLibres} plazas</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-600">Plazas Ocupadas</p>
                    <p className="font-medium">{parking.plazasOcupadas} plazas</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Plantas del Parking</h3>
                  {parking.plantas && parking.plantas.length > 0 ? (
                    <div className="space-y-3">
                      {parking.plantas.map(planta => (
                        <div key={planta.id} className="border rounded-md p-3">
                          <h4 className="font-medium">Planta {planta.numero}</h4>
                          <p className="text-sm text-slate-500">
                            {planta.plazas.length} plazas en total
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No hay información de plantas disponible</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="plazas" className="m-0">
              {showReservationForm ? (
                <ReservationForm
                  parkingId={parking.id}
                  onCancel={handleCancelReservation}
                  plantas={parking.plantas}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">Plazas Disponibles</h3>
                  {parking.plantas?.some(planta =>
                    planta.plazas?.some(plaza => plaza.estado === 'Libre' && plaza.reservable)
                  ) ? (
                      <div>
                        {parking.plantas.map(planta => {
                          const plazasLibres = planta.plazas.filter(
                            plaza => plaza.estado === 'Libre' && plaza.reservable
                          )

                          if (plazasLibres.length === 0) return null

                          return (
                            <div key={planta.id} className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Planta {planta.numero}</h4>
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {plazasLibres.map(plaza => (
                                  <div
                                    key={plaza.id}
                                    className="border rounded-md p-3 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-center mb-1">
                                      <CarIcon className="h-4 w-4 mr-1" />
                                      <span className="font-medium">Plaza {plaza.numero}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{plaza.tipo}</div>
                                    <div className="text-xs font-medium mt-1">{plaza.precioHora}€/hora</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}

                        <Button
                          className="mt-4"
                          onClick={handleMakeReservation}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                        Hacer una reserva
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-md">
                        <p className="text-amber-600">
                        No hay plazas disponibles para reservar en este momento.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="anuncios" className="m-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Anuncios</h3>
                  {loadingAnuncios && (
                    <div className="flex items-center text-sm text-slate-500">
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Cargando...
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {anuncios.length > 0 ? (
                    anuncios.map(anuncio => (
                      <Card key={anuncio.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">
                              <BellIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm">{anuncio.contenido}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(anuncio.created_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-4">
                        <p className="italic text-slate-500">
                          No hay anuncios en este momento.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ParkingDetails