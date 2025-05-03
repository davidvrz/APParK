import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select"
import {
  RESERVA_ANTICIPACION_MIN,
  RESERVA_TIEMPO_MIN,
  RESERVA_TIEMPO_MAX
} from "@/config"

export default function ReservaEditForm({
  reserva,
  vehiculos = [],
  plazasDisponibles = [],
  onCancel,
  onSave,
  apiError = null,    // Error proveniente del hook useReservas
  isLoading = false   // Estado de carga general
}) {
  const [form, setForm] = useState({
    vehicleId: "",
    plazaId: "",
    startTime: "",
    endTime: ""
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Filtrar plazas según el tipo de vehículo seleccionado
  const plazasFiltradas = useMemo(() => {
    const vehiculoSeleccionado = vehiculos.find(v => String(v.id) === form.vehicleId)
    if (!vehiculoSeleccionado) return plazasDisponibles
    return plazasDisponibles.filter(p => p.tipo === vehiculoSeleccionado.tipo)
  }, [form.vehicleId, vehiculos, plazasDisponibles])

  // 1) Inicializar formulario al montar o cambiar reserva
  useEffect(() => {
    if (!reserva) return

    // Extraer IDs de vehículo y plaza, teniendo en cuenta diferentes estructuras posibles
    const vid = reserva.vehicle?.id || reserva.vehiculo_id || reserva.vehicleId
    const pid = reserva.plaza?.id || reserva.plaza_id || reserva.plazaId

    // Convertir a string y asegurar que no sea undefined
    const vehicleId = vid !== undefined ? String(vid) : ""
    const plazaId = pid !== undefined ? String(pid) : ""

    setForm({
      vehicleId,
      plazaId,
      startTime: new Date(reserva.startTime).toISOString().slice(0, 16),
      endTime: new Date(reserva.endTime).toISOString().slice(0, 16),
    })

    setErrors({})
    setSuccess(false)
  }, [reserva, vehiculos, plazasDisponibles])

  // 2) Capturar errores de la API
  useEffect(() => {
    if (apiError) {
      setErrors(prev => ({ ...prev, server: apiError }))
    }
  }, [apiError])

  // 3) Validaciones básicas
  const validate = () => {
    const errs = {}
    const start = new Date(form.startTime)
    const end   = new Date(form.endTime)

    if (!form.startTime) errs.startTime = "La fecha de inicio es obligatoria"
    if (!form.endTime)   errs.endTime   = "La fecha de fin es obligatoria"
    if (!form.vehicleId) errs.vehicleId = "Debes seleccionar un vehículo"
    if (!form.plazaId)   errs.plazaId   = "Debes seleccionar una plaza"

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSelect = (field) => (value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSave({
        vehicleId: parseInt(form.vehicleId),
        plazaId: parseInt(form.plazaId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      })
      setSuccess(true)
      // Cerramos tras un momento para que se vea el mensaje
      setTimeout(onCancel, 1500)
    } catch (err) {
      const msg = err.response?.data?.error || "Error al modificar la reserva"
      setErrors(prev => ({ ...prev, server: msg }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensaje de error general */}
      {(errors.server || apiError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-display font-medium">Error</AlertTitle>
          <AlertDescription className="font-normal">
            {errors.server || apiError}
          </AlertDescription>
        </Alert>
      )}

      {/* Mensaje de éxito */}
      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="font-display font-medium">Éxito</AlertTitle>
          <AlertDescription className="font-normal">Reserva modificada correctamente</AlertDescription>
        </Alert>
      )}

      {/* Selección de vehículo y plaza */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={`${errors.vehicleId ? "text-red-500" : ""} font-medium`}>
            Vehículo {errors.vehicleId && `(${errors.vehicleId})`}
          </Label>
          <Select
            value={form.vehicleId}
            onValueChange={handleSelect("vehicleId")}
            disabled={isLoading || submitting}
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

        <div>
          <Label className={`${errors.plazaId ? "text-red-500" : ""} font-medium`}>
            Plaza {errors.plazaId && `(${errors.plazaId})`}
          </Label>
          <Select
            value={form.plazaId}
            onValueChange={handleSelect("plazaId")}
            disabled={isLoading || submitting}
          >
            <SelectTrigger className={`w-full ${errors.plazaId ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Selecciona una plaza" />
            </SelectTrigger>
            <SelectContent>
              {plazasFiltradas.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  Plaza {p.numero} — Planta {p.planta?.numero || "N/A"} ({p.tipo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fechas y horas con rangos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className={`${errors.startTime || errors.ahead ? "text-red-500" : ""} font-medium`}>
            Inicio {errors.startTime && `(${errors.startTime})`}
          </Label>
          <Input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            disabled={isLoading || submitting}
            className={`w-full ${errors.startTime || errors.ahead ? "border-red-500" : ""}`}
            min={new Date(Date.now() + RESERVA_ANTICIPACION_MIN * 60000)
              .toISOString().slice(0,16)}
          />
          {errors.ahead && <p className="text-red-500 text-xs font-normal">{errors.ahead}</p>}
        </div>
        <div>
          <Label className={`${errors.endTime || errors.duration ? "text-red-500" : ""} font-medium`}>
            Fin {errors.endTime && `(${errors.endTime})`}
          </Label>
          <Input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            disabled={isLoading || submitting}
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
          {errors.duration && <p className="text-red-500 text-xs font-normal">{errors.duration}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || submitting}
          className="font-medium"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || submitting || success}
          className="font-medium"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cargando...
            </>
          ) : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}
