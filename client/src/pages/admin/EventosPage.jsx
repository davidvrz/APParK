import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, Search, AlertCircle, Info, CheckCircle, Calendar, Loader2, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useParking } from "@/hooks/useParking"
import { useEventos } from "@/hooks/useEventos"
import { useSocketEventos } from "@/hooks/useSocketEventos"
import { formatDateTime } from "@/lib/utils"

function EventosPage() {
  const { parkings, loading: parkingsLoading } = useParking()
  const { eventos, loading: eventosLoading, fetchAllEventos } = useEventos()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParking, setSelectedParking] = useState("all")
  const [tipoFilter, setTipoFilter] = useState("all")
  const parkingIds = useMemo(() => parkings.map(p => p.id), [parkings])

  const { connected, eventosEnTiempoReal, clearEventosEnTiempoReal, updateEventoEnTiempoReal } = useSocketEventos(parkingIds)

  const allEvents = useMemo(() => {
    const eventosRT = eventosEnTiempoReal.filter(eventoRT =>
      !eventos.some(eventoBD =>
        eventoBD.plazaId === eventoRT.plazaId &&
        Math.abs(new Date(eventoBD.fecha) - new Date(eventoRT.fecha)) < 5000
      )
    )

    // Combinar y ordenar por fecha
    const combined = [...eventosRT, ...eventos]
    return combined.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }, [eventos, eventosEnTiempoReal])

  useEffect(() => {
    if (parkings.length > 0) {
      const parkingIds = parkings.map(p => p.id)
      fetchAllEventos(parkingIds)
    }
  }, [parkings, fetchAllEventos])

  useEffect(() => {
    if (eventosEnTiempoReal.length > 0) {
      const ultimoEvento = eventosEnTiempoReal[0]
      if (ultimoEvento.isNew) {
        setTimeout(() => {
          updateEventoEnTiempoReal(prev =>
            prev.map(evento =>
              evento.id === ultimoEvento.id ? { ...evento, isNew: false } : evento
            )
          )
        }, 1000)
      }
    }
  }, [eventosEnTiempoReal, updateEventoEnTiempoReal])

  const getEventoIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
    case 'entrada':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'salida':
      return <Info className="h-4 w-4 text-blue-500" />
    case 'anomalia':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventoBadgeColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
    case 'entrada':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'salida':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'anomalia':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredEventos = allEvents.filter(evento => {
    const matchesSearch = !searchTerm ||
      evento.mensaje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.parking?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.plaza?.numero?.toString().includes(searchTerm) ||
      evento.planta?.numero?.toString().includes(searchTerm)

    const matchesParking = selectedParking === "all" || evento.parking?.id === selectedParking
    const matchesTipo = tipoFilter === "all" || evento.tipoEvento === tipoFilter

    return matchesSearch && matchesParking && matchesTipo
  }).slice(0, 25) // Limitar a los últimos 25 eventos
  const eventosStats = {
    total: allEvents.length,
    entradas: allEvents.filter(e => e.tipoEvento === 'entrada').length,
    salidas: allEvents.filter(e => e.tipoEvento === 'salida').length,
    anomalías: allEvents.filter(e => e.tipoEvento === 'anomalia').length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Eventos y Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitorea la actividad del sistema en tiempo real
          </p>
          <div className="flex items-center gap-2 mt-2">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Tiempo real activo</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Tiempo real desconectado</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{eventosStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Entradas</p>
                <p className="text-2xl font-bold">{eventosStats.entradas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Salidas</p>
                <p className="text-2xl font-bold">{eventosStats.salidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Anomalías</p>
                <p className="text-2xl font-bold">{eventosStats.anomalías}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por descripción, parking, plaza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedParking} onValueChange={setSelectedParking}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos los parkings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los parkings</SelectItem>
            {parkings.map((parking) => (
              <SelectItem key={parking.id} value={parking.id}>
                {parking.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="salida">Salidas</SelectItem>
            <SelectItem value="anomalia">Anomalías</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {parkingsLoading || eventosLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredEventos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-6" />
              <h2 className="text-xl font-semibold mb-2">
                {searchTerm || selectedParking !== "all" || tipoFilter !== "all"
                  ? 'No se encontraron eventos'
                  : 'No hay eventos registrados'
                }
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedParking !== "all" || tipoFilter !== "all"
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Los eventos aparecerán aquí cuando haya actividad en el sistema'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEventos.map((evento) => (
              <motion.div
                key={evento.id}
                initial={evento.isNew ? { opacity: 0, scale: 0.95, y: -20 } : false}
                animate={evento.isNew ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Card className={`hover:shadow-md transition-shadow ${
                  evento.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getEventoIcon(evento.tipoEvento)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${getEventoBadgeColor(evento.tipoEvento)}`}>
                            {evento.tipoEvento || 'Unknown'}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {evento.parking?.nombre}
                          </span>
                          {evento.matricula && (
                            <span className="text-sm text-gray-500">
                            Matrícula: {evento.matricula}
                            </span>
                          )}
                          {evento.plaza && (
                            <span className="text-sm text-gray-500">
                            Plaza {evento.plaza.numero} - Planta {evento.planta?.numero}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {evento.mensaje || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDateTime(evento.fecha)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredEventos.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Mostrando {filteredEventos.length} de {allEvents.length} eventos
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default EventosPage
