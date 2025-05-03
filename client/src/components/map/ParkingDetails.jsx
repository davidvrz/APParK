import { useState, useEffect, useRef } from 'react'
import { useParking } from '@/hooks/useParking'
import ParkingReservationFlow from './ParkingReservationFlow'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeftIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  Loader2,
  Layout,
  InfoIcon
} from 'lucide-react'

const ParkingDetails = ({ parking: parkingPreview, onClose, initialSection = 'info' }) => {
  const [activeTab, setActiveTab] = useState(initialSection)
  const [loadingAnuncios, setLoadingAnuncios] = useState(false)
  const anunciosLoadedRef = useRef(false)
  const { parking, anuncios, loading, error, fetchParkingById, fetchAnuncios } = useParking()

  useEffect(() => {
    // Fetch complete parking details when a parking is selected
    if (parkingPreview?.id) {
      fetchParkingById(parkingPreview.id)
      // Resetear el estado de carga de anuncios cuando cambia el parking
      anunciosLoadedRef.current = false
    }
  }, [parkingPreview?.id, fetchParkingById])

  // Cargar anuncios solo cuando se selecciona la pestaña de anuncios y no se han cargado ya
  useEffect(() => {
    if (activeTab === 'info' && parking?.id && !loadingAnuncios && !anunciosLoadedRef.current) {
      setLoadingAnuncios(true)
      fetchAnuncios(parking.id)
        .then(() => {
          // Marcar que los anuncios ya se han cargado
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
        <Tabs defaultValue={initialSection} value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="info" className="flex items-center gap-1.5">
                <InfoIcon className="h-4 w-4" />
                <span>Información</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-1.5">
                <Layout className="h-4 w-4" />
                <span>Plano y Reservas</span>
              </TabsTrigger>
              <TabsTrigger value="reservation" className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>Reservar</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            {/* SECCIÓN DE INFORMACIÓN */}
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

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Anuncios</h3>
                  {loadingAnuncios ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
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

            {/* SECCIÓN DEL PLANO Y RESERVAS */}
            <TabsContent value="plan" className="m-0">
              <ParkingReservationFlow
                parking={parking}
                onCancel={() => setActiveTab('info')}
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
                onCancel={() => setActiveTab('info')}
                skipPlano={true}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ParkingDetails