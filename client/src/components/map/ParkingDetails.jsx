import { useState, useEffect, useRef } from 'react'
import { useParking } from '@/hooks/useParking'
import ParkingReservationFlow from './ParkingReservationFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeftIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  Loader2,
  Layout,
  CircleDashed
} from 'lucide-react'

const ParkingDetails = ({ parking: parkingPreview, onClose, initialSection = 'plan' }) => {
  const [activeTab, setActiveTab] = useState(initialSection)
  const [loadingAnuncios, setLoadingAnuncios] = useState(false)
  const anunciosLoadedRef = useRef(false)
  const { parking, anuncios, loading, error, fetchParkingById, fetchAnuncios } = useParking()

  useEffect(() => {
    if (parkingPreview?.id) {
      fetchParkingById(parkingPreview.id)
      // Resetear el estado de carga de anuncios cuando cambia el parking
      anunciosLoadedRef.current = false
    }
  }, [parkingPreview?.id, fetchParkingById])

  // Cargar anuncios solo cuando se selecciona la pestaña de anuncios y no se han cargado ya
  useEffect(() => {
    if (activeTab === 'anuncios' && parking?.id && !loadingAnuncios && !anunciosLoadedRef.current) {
      setLoadingAnuncios(true)
      fetchAnuncios(parking.id)
        .then(() => {
          anunciosLoadedRef.current = true
        })
        .finally(() => {
          setLoadingAnuncios(false)
        })
    }
  }, [activeTab, parking?.id, fetchAnuncios])

  if (loading) {
    return (
      <Card className="h-full w-full overflow-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
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
    <div className="h-full w-full overflow-auto flex flex-col">
      {/* Cabecera fija */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 -ml-2 h-8 w-8 flex-shrink-0"
              onClick={onClose}
              title="Volver al mapa"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-xl font-semibold">{parking.nombre}</h1>
              <div className="flex items-center mt-1 text-sm text-slate-500">
                <MapPinIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{parking.ubicacion}</span>
              </div>
              <div className="flex flex-wrap items-center mt-2 text-xs text-slate-600 gap-x-3 gap-y-1">
                <div>
                  <span className="font-semibold">{parking.capacidad}</span> plazas
                </div>
                <div className="hidden sm:block w-0.5 h-3 bg-slate-200"></div>
                <div className="text-green-600">
                  <span className="font-semibold">{parking.plazasLibres}</span> libres
                </div>
                <div className="hidden sm:block w-0.5 h-3 bg-slate-200"></div>
                <div className="text-red-600">
                  <span className="font-semibold">{parking.plazasOcupadas}</span> ocupadas
                </div>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`flex-shrink-0 ${parking.estado === 'Operativo' ? 'text-green-600 border-green-200' :
              parking.estado === 'Cerrado' ? 'text-red-600 border-red-200' :
                'text-amber-600 border-amber-200'}`}
          >
            {parking.estado}
          </Badge>
        </div>
      </div>      {/* Contenido principal con tabs */}
      <div className="flex-grow">
        <Tabs defaultValue={initialSection} value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="flex justify-center border-b">
            <div className="bg-slate-50 px-2 rounded-t-lg">
              <TabsList className="bg-transparent">
                <TabsTrigger value="plan" className="flex items-center gap-1.5 data-[state=active]:bg-white">
                  <Layout className="h-4 w-4" />
                  <span className="hidden sm:inline">Plano y Reservas</span>
                  <span className="sm:hidden">Plano</span>
                </TabsTrigger>
                <TabsTrigger value="reservation" className="flex items-center gap-1.5 data-[state=active]:bg-white">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Crear Reserva</span>
                  <span className="sm:hidden">Reservar</span>
                </TabsTrigger>
                <TabsTrigger value="anuncios" className="flex items-center gap-1.5 data-[state=active]:bg-white">
                  <BellIcon className="h-4 w-4" />
                  <span>Anuncios</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="p-4">
            {/* SECCIÓN DEL PLANO Y RESERVAS */}
            <TabsContent value="plan" className="m-0">
              <ParkingReservationFlow
                parking={parking}
                onCancel={onClose}
              />
            </TabsContent>

            {/* SECCIÓN DE FORMULARIO DE RESERVA */}
            <TabsContent value="reservation" className="m-0">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-blue-800 mb-1">Reserva una plaza en {parking.nombre}</h3>
                <p className="text-sm text-blue-700">
                  Completa el formulario para reservar una plaza en este parking.
                </p>
              </div>

              <ParkingReservationFlow
                parking={parking}
                onCancel={() => setActiveTab('plan')}
                skipPlano={true}
              />
            </TabsContent>

            {/* SECCIÓN DE ANUNCIOS */}
            <TabsContent value="anuncios" className="m-0">
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <CircleDashed className="h-5 w-5 text-blue-500" />
                  Anuncios y Notificaciones
                </h3>

                {loadingAnuncios ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-500" />
                    <span>Cargando anuncios...</span>
                  </div>
                ) : anuncios.length > 0 ? (
                  <div className="space-y-3">
                    {anuncios.map(anuncio => (
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
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="italic text-slate-500">
                        No hay anuncios o notificaciones en este momento.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default ParkingDetails