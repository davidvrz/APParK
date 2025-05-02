import { useState, useEffect } from 'react'
import { useVehiculos } from '@/hooks/useVehiculos'
import { useReservas } from '@/hooks/useReservas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { CalendarIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { RESERVA_TIEMPO_MIN, RESERVA_TIEMPO_MAX, RESERVA_ANTICIPACION_MIN } from '@/config'

const ReservationForm = ({ parkingId, plantas = [], onCancel }) => {
  const [form, setForm] = useState({
    vehicleId: '',
    plazaId: '',
    startTime: '',
    endTime: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedTipoVehiculo, setSelectedTipoVehiculo] = useState(null)

  const { vehiculos, loading: loadingVehiculos } = useVehiculos()
  const { crearReserva, error: reservaError, clearError } = useReservas()
  
  // Plazas filtradas por tipo de vehículo
  const plazasDisponibles = plantas.flatMap(planta => 
    planta.plazas
      .filter(plaza => 
        plaza.estado === 'Libre' && 
        plaza.reservable && 
        (!selectedTipoVehiculo || plaza.tipo === selectedTipoVehiculo)
      )
      .map(plaza => ({
        ...plaza,
        plantaId: planta.id,
        plantaNumero: planta.numero
      }))
  )

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSelectVehicle = (value) => {
    setForm(prev => ({ ...prev, vehicleId: value }))
    
    // Actualizar tipo de vehículo para filtrar plazas
    const vehiculo = vehiculos.find(v => String(v.id) === value)
    setSelectedTipoVehiculo(vehiculo ? vehiculo.tipo : null)
    
    // Limpiar plaza seleccionada si cambia el tipo de vehículo
    setForm(prev => ({ ...prev, plazaId: '' }))
    
    if (errors.vehicleId) setErrors(prev => ({ ...prev, vehicleId: undefined }))
  }

  const handleSelectPlaza = (value) => {
    setForm(prev => ({ ...prev, plazaId: value }))
    if (errors.plazaId) setErrors(prev => ({ ...prev, plazaId: undefined }))
  }

  // Validación
  const validate = () => {
    const errs = {}
    const start = new Date(form.startTime)
    const end = new Date(form.endTime)

    if (!form.vehicleId) errs.vehicleId = "Debes seleccionar un vehículo"
    if (!form.plazaId) errs.plazaId = "Debes seleccionar una plaza"
    if (!form.startTime) errs.startTime = "La fecha de inicio es obligatoria"
    if (!form.endTime) errs.endTime = "La fecha de fin es obligatoria"

    if (form.startTime && form.endTime) {
      if (end <= start) {
        errs.endTime = "La fecha de fin debe ser posterior a la de inicio"
      }
      
      const diffMin = (end - start) / 60000
      if (diffMin < RESERVA_TIEMPO_MIN || diffMin > RESERVA_TIEMPO_MAX) {
        errs.duration = `La reserva debe durar entre ${RESERVA_TIEMPO_MIN} y ${RESERVA_TIEMPO_MAX} minutos`
      }
      
      const now = new Date()
      const diffAhead = (start - now) / 60000
      if (diffAhead < RESERVA_ANTICIPACION_MIN) {
        errs.ahead = `La reserva debe hacerse con al menos ${RESERVA_ANTICIPACION_MIN} minutos de antelación`
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setSuccess(false)
    
    if (!validate()) return
    
    setSubmitting(true)
    try {
      await crearReserva({
        vehicleId: parseInt(form.vehicleId),
        plazaId: parseInt(form.plazaId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      })
      
      setSuccess(true)
      setTimeout(() => {
        onCancel()
      }, 2000)
    } catch (err) {
      const msg = err.response?.data?.error || "Error al crear la reserva"
      setErrors(prev => ({ ...prev, server: msg }))
    } finally {
      setSubmitting(false)
    }
  }

  // Establecer fecha actual + 30 min como valor predeterminado para inicio
  useEffect(() => {
    const now = new Date()
    const startDefault = new Date(now.getTime() + RESERVA_ANTICIPACION_MIN * 60000)
    const endDefault = new Date(startDefault.getTime() + 60 * 60000) // +1 hora por defecto
    
    setForm(prev => ({
      ...prev,
      startTime: startDefault.toISOString().slice(0, 16),
      endTime: endDefault.toISOString().slice(0, 16)
    }))
  }, [])

  if (loadingVehiculos) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Cargando vehículos...</p>
      </div>
    )
  }

  if (vehiculos.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Realizar Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No tienes vehículos registrados</AlertTitle>
            <AlertDescription>
              Necesitas registrar al menos un vehículo para poder hacer una reserva.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Volver
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Realizar Reserva</CardTitle>
        <CardDescription>Completa el formulario para reservar una plaza</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Mensaje de error general */}
          {(errors.server || reservaError) && (
            <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors.server || reservaError}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>¡Reserva creada!</AlertTitle>
              <AlertDescription>
                Tu reserva ha sido creada correctamente.
              </AlertDescription>
            </Alert>
          )}

          {/* Selección de vehículo */}
          <div>
            <Label className={`${errors.vehicleId ? "text-red-500" : ""}`}>
              Vehículo {errors.vehicleId && `(${errors.vehicleId})`}
            </Label>
            <Select
              value={form.vehicleId}
              onValueChange={handleSelectVehicle}
              disabled={submitting}
            >
              <SelectTrigger className={`w-full ${errors.vehicleId ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Selecciona un vehículo" />
              </SelectTrigger>
              <SelectContent>
                {vehiculos.map(v => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.matricula} — {v.tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selección de plaza */}
          <div>
            <Label className={`${errors.plazaId ? "text-red-500" : ""}`}>
              Plaza {errors.plazaId && `(${errors.plazaId})`}
            </Label>
            <Select
              value={form.plazaId}
              onValueChange={handleSelectPlaza}
              disabled={submitting || !selectedTipoVehiculo}
            >
              <SelectTrigger className={`w-full ${errors.plazaId ? "border-red-500" : ""}`}>
                <SelectValue placeholder={selectedTipoVehiculo ? "Selecciona una plaza" : "Selecciona primero un vehículo"} />
              </SelectTrigger>
              <SelectContent>
                {plazasDisponibles.length > 0 ? (
                  plazasDisponibles.map(plaza => (
                    <SelectItem key={plaza.id} value={String(plaza.id)}>
                      Plaza {plaza.numero} — Planta {plaza.plantaNumero} ({plaza.tipo})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {selectedTipoVehiculo 
                      ? `No hay plazas disponibles para vehículos tipo ${selectedTipoVehiculo}` 
                      : "Selecciona primero un vehículo"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Fechas y horas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={`${errors.startTime || errors.ahead ? "text-red-500" : ""}`}>
                Inicio {errors.startTime && `(${errors.startTime})`}
              </Label>
              <Input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                disabled={submitting}
                className={`w-full ${errors.startTime || errors.ahead ? "border-red-500" : ""}`}
                min={new Date(Date.now() + RESERVA_ANTICIPACION_MIN * 60000)
                  .toISOString().slice(0,16)}
              />
              {errors.ahead && <p className="text-red-500 text-xs mt-1">{errors.ahead}</p>}
            </div>
            
            <div>
              <Label className={`${errors.endTime || errors.duration ? "text-red-500" : ""}`}>
                Fin {errors.endTime && `(${errors.endTime})`}
              </Label>
              <Input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                disabled={submitting}
                className={`w-full ${errors.endTime || errors.duration ? "border-red-500" : ""}`}
                min={
                  form.startTime
                    ? new Date(new Date(form.startTime).getTime() + RESERVA_TIEMPO_MIN * 60000)
                        .toISOString().slice(0,16)
                    : undefined
                }
                max={
                  form.startTime
                    ? new Date(new Date(form.startTime).getTime() + RESERVA_TIEMPO_MAX * 60000)
                        .toISOString().slice(0,16)
                    : undefined
                }
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 border-t p-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={submitting || success}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={submitting || success}
            className="gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Reserva creada
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4" />
                Reservar plaza
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ReservationForm