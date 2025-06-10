import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Search, RefreshCw, AlertCircle, Info, CheckCircle, Calendar, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useParking } from "@/hooks/useParking"
import { useEventos } from "@/hooks/useEventos"
import { formatDateTime } from "@/lib/utils"
import { toast } from "sonner"

function EventosPage() {
  const { parkings, loading: parkingsLoading } = useParking()
  const { eventos, loading: eventosLoading, fetchAllEventos } = useEventos()
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParking, setSelectedParking] = useState("all")
  const [tipoFilter, setTipoFilter] = useState("all")

  useEffect(() => {
    if (parkings.length > 0) {
      const parkingIds = parkings.map(p => p.id)
      fetchAllEventos(parkingIds)
    }
  }, [parkings, fetchAllEventos])

  const handleRefresh = async () => {
    if (parkings.length === 0) return

    setRefreshing(true)
    try {
      const parkingIds = parkings.map(p => p.id)
      await fetchAllEventos(parkingIds)
      toast.success('Eventos actualizados')
    } catch (error) {
      console.error('Error refreshing eventos:', error)
      toast.error('Error al actualizar eventos')
    } finally {
      setRefreshing(false)
    }
  }
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

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = !searchTerm ||
      evento.mensaje?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.parking?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evento.plaza?.numero?.toString().includes(searchTerm) ||
      evento.planta?.numero?.toString().includes(searchTerm)

    const matchesParking = selectedParking === "all" || evento.parking?.id === selectedParking
    const matchesTipo = tipoFilter === "all" || evento.tipoEvento === tipoFilter

    return matchesSearch && matchesParking && matchesTipo
  })

  const eventosStats = {
    total: eventos.length,
    entradas: eventos.filter(e => e.tipoEvento === 'entrada').length,
    salidas: eventos.filter(e => e.tipoEvento === 'salida').length,
    errores: eventos.filter(e => e.tipoEvento === 'anomalia').length
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
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Errores</p>
                <p className="text-2xl font-bold">{eventosStats.errores}</p>
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
              <Card key={evento.id} className="hover:shadow-md transition-shadow">
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
                            Plaza {evento.plaza.numero} - {evento.planta?.nombre}
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
                        {evento.usuario && (
                          <div className="flex items-center gap-1">
                            <span>👤 {evento.usuario.nombre} {evento.usuario.apellidos}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredEventos.length > 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Mostrando {filteredEventos.length} de {eventos.length} eventos
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
