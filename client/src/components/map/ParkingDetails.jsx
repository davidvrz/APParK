import { useState, useEffect, useRef } from 'react'
import { useParking } from '@/hooks/useParking'
import { useSocketParking } from '@/hooks/useSocketParking'
import { useReserva } from '@/hooks/useReserva'
import ParkingReservationFlow from './ParkingReservationFlow'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
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
  const [plantas, setPlantas] = useState([])
  const anunciosLoadedRef = useRef(false)
  const lastParkingIdRef = useRef(null)

  const { parking, anuncios, loading, error, fetchParkingById, fetchAnuncios } = useParking()
  const {
    connected,
    plazasActualizadas,
    clearUpdates,
    requestRefresh  } = useSocketParking(parkingPreview?.id)

  const {
    fetchReservasParking,
    getReservasEstaSemana,
    getReservasPorPlaza,
    getProximasReservas
  } = useReserva()

  useEffect(() => {
    if (parking?.plantas) {
      setPlantas(parking.plantas)
    }
  }, [parking?.plantas])

  // Cargar reservas del parking cuando cambie el parking
  useEffect(() => {
    if (parking?.id) {
      fetchReservasParking(parking.id)
    }
  }, [parking?.id, fetchReservasParking])

  // Socket: procesar actualizaciones de plazas con debounce
  useEffect(() => {
    if (plazasActualizadas.length === 0) return

    // Debounce para agrupar eventos simultáneos
    const timeoutId = setTimeout(() => {
      // Procesar todas las actualizaciones en batch
      setPlantas(prevPlantas => {
        return prevPlantas.map(planta => ({
          ...planta,
          plazas: planta.plazas.map(plaza => {
            // Buscar si esta plaza tiene alguna actualización pendiente
            const updateForThisPlaza = plazasActualizadas.find(update => update.id === plaza.id)
            if (updateForThisPlaza) {
              return { ...plaza, estado: updateForThisPlaza.estado }
            }
            return plaza
          })
        }))
      })

      // Recargar reservas del parking cuando haya cambios de socket
      if (parking?.id) {
        fetchReservasParking(parking.id)
      }

      // Limpiar actualizaciones procesadas
      clearUpdates()
    }, 50) // 50ms de debounce para agrupar eventos simultáneos

    return () => clearTimeout(timeoutId)
  }, [plazasActualizadas, clearUpdates, parking, fetchReservasParking])

  useEffect(() => {
    const currentParkingId = parkingPreview?.id

    if (currentParkingId && lastParkingIdRef.current !== currentParkingId) {
      fetchParkingById(currentParkingId)
      lastParkingIdRef.current = currentParkingId
      anunciosLoadedRef.current = false
    }
  }, [parkingPreview?.id, fetchParkingById])

  useEffect(() => {
    if (activeTab === 'anuncios' &&
        parking?.id &&
        !anunciosLoadedRef.current &&
        !loadingAnuncios) {

      setLoadingAnuncios(true)
      fetchAnuncios(parking.id)
        .finally(() => {
          setLoadingAnuncios(false)
          anunciosLoadedRef.current = true
        })
    }
  }, [activeTab, parking?.id, fetchAnuncios, loadingAnuncios])

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
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header con información del parking */}
      <div className="bg-background border-b">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Botón volver y título */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-muted shrink-0"
                onClick={onClose}
                title="Volver al mapa"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-bold text-foreground truncate">{parking.nombre}</h1>
                  <Badge
                    variant="outline"
                    className={`shrink-0 px-2 py-1 ${
                      parking.estado === 'Operativo'
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800' :
                        parking.estado === 'Cerrado'
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                    }`}
                  >
                    {parking.estado}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 mr-1.5 shrink-0" />
                  <span className="truncate">{parking.ubicacion}</span>
                </div>
              </div>
            </div>

            {/* Estadísticas del parking */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{parking.capacidad}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{parking.plazasLibres}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Libres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{parking.plazasOcupadas}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Ocupadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{parking.plazasReservadas || 0}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Reservadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación con tabs */}
        <div className="border-t border-border/50">
          <Tabs defaultValue={initialSection} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 p-0 bg-transparent rounded-none">
              <TabsTrigger
                value="plan"
                className="flex-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-sm"
              >
                <Layout className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Plano y Reservas</span>
                <span className="sm:hidden">Plano</span>
              </TabsTrigger>
              <TabsTrigger
                value="reservation"
                className="flex-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-sm"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Crear Reserva</span>
                <span className="sm:hidden">Reservar</span>
              </TabsTrigger>
              <TabsTrigger
                value="anuncios"
                className="flex-1 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-sm"
              >
                <BellIcon className="h-4 w-4 mr-2" />
                Anuncios
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue={initialSection} value={activeTab} onValueChange={setActiveTab}>
          <div className="p-6">
            <TabsContent value="plan" className="m-0">
              <ParkingReservationFlow
                parking={{ ...parking, plantas }}
                socketData={{ connected, requestRefresh }}
                reservaData={{
                  getReservasEstaSemana,
                  getReservasPorPlaza,
                  getProximasReservas
                }}
                onCancel={onClose}
              />
            </TabsContent>

            <TabsContent value="reservation" className="m-0">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-6">
                <h3 className="font-display font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Reserva una plaza en {parking.nombre}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Completa el formulario para reservar una plaza en este parking.
                </p>
              </div>
              <ParkingReservationFlow
                parking={{ ...parking, plantas }}
                socketData={{ connected, requestRefresh }}
                reservaData={{
                  getReservasEstaSemana,
                  getReservasPorPlaza,
                  getProximasReservas
                }}
                onCancel={() => setActiveTab('plan')}
                skipPlano={true}
              />
            </TabsContent>
            <TabsContent value="anuncios" className="m-0">
              <div className="space-y-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">
                  Anuncios y Notificaciones
                </div>

                {loadingAnuncios ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mr-3 text-primary" />
                    <span className="text-sm text-muted-foreground">Cargando anuncios...</span>
                  </div>
                ) : anuncios.length > 0 ? (
                  <div className="space-y-4">
                    {anuncios.map(anuncio => (
                      <div
                        key={anuncio.id}
                        className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground leading-relaxed">{anuncio.contenido}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDateTime(anuncio.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-3 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CircleDashed className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No hay anuncios disponibles en este momento.
                    </p>
                  </div>
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