import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { RESERVA_ANTICIPACION_MIN, RESERVA_TIEMPO_MIN, RESERVA_TIEMPO_MAX } from "@/config"
import { formatTimeForInput } from "@/lib/utils"

export default function ReservaEditForm({
  reserva,
  vehiculos = [],
  parking = null,
  onCancel,
  onSave,
  apiError = null, // Error proveniente del hook useReserva
  isLoading = false
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

  // Obtener plazas disponibles
  const plazasDisponibles = useMemo(() => {
    if (!parking?.plantas) return []

    return parking.plantas.flatMap(planta => {
      return planta.plazas?.map(plaza => ({
        ...plaza,
        planta: {
          id: planta.id,
          numero: planta.numero,
          parking_id: planta.parking_id
        }
      })) || []
    })
  }, [parking])

  // Filtrar plazas según el tipo de vehículo seleccionado
  const plazasFiltradas = useMemo(() => {
    const vehiculoSeleccionado = vehiculos.find(v => String(v.id) === form.vehicleId)
    if (!vehiculoSeleccionado) return plazasDisponibles
    return plazasDisponibles.filter(p => p.tipo === vehiculoSeleccionado.tipo)
  }, [form.vehicleId, vehiculos, plazasDisponibles])

  useEffect(() => {
    if (!reserva) return

    const vehicleId = reserva.vehicle?.id ? String(reserva.vehicle.id) : ""
    const plazaId = reserva.plaza?.id ? String(reserva.plaza.id) : ""

    setForm({
      vehicleId,
      plazaId,
      startTime: formatTimeForInput(reserva.startTime),
      endTime: formatTimeForInput(reserva.endTime)
    })

    setErrors({})
    setSuccess(false)
  }, [reserva, vehiculos, plazasDisponibles])

  useEffect(() => {
    if (apiError) {
      setErrors(prev => ({ ...prev, server: apiError }))
    }
  }, [apiError])

  const validate = () => {
    const errs = {}

    if (!form.startTime) errs.startTime = "La fecha de inicio es obligatoria"
    if (!form.endTime) errs.endTime = "La fecha de fin es obligatoria"
    if (!form.vehicleId) errs.vehicleId = "Debes seleccionar un vehículo"
    if (!form.plazaId) errs.plazaId = "Debes seleccionar una plaza"

    if (form.startTime && form.endTime) {
      const start = new Date(form.startTime)
      const end = new Date(form.endTime)
      const now = new Date()

      if (isNaN(start.getTime())) {
        errs.startTime = "Fecha de inicio inválida"
      }
      if (isNaN(end.getTime())) {
        errs.endTime = "Fecha de fin inválida"
      }

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (end <= start) {
          errs.endTime = "La fecha de fin debe ser posterior a la de inicio"
        } else {
          const diffMin = (end - start) / (1000 * 60)
          if (diffMin < RESERVA_TIEMPO_MIN) {
            errs.duration = `La reserva debe durar al menos ${RESERVA_TIEMPO_MIN} minutos`
          } else if (diffMin > RESERVA_TIEMPO_MAX) {
            errs.duration = `La reserva no puede durar más de ${RESERVA_TIEMPO_MAX} minutos`
          }
        }

        if (!isNaN(start.getTime())) {
          const diffAhead = (start - now) / (1000 * 60)
          if (diffAhead < RESERVA_ANTICIPACION_MIN) {
            errs.ahead = `La reserva debe modificarse con al menos ${RESERVA_ANTICIPACION_MIN} minutos de antelación`
          }
        }
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
      const result = await onSave({
        vehicleId: parseInt(form.vehicleId),
        plazaId: parseInt(form.plazaId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      })
      if (result !== false) {
        setSuccess(true)
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Error al modificar la reserva"
      setErrors(prev => ({ ...prev, server: msg }))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(errors.server || apiError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-display font-medium">Error</AlertTitle>
          <AlertDescription className="font-normal">
            {errors.server || apiError}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="font-display font-medium">Éxito</AlertTitle>
          <AlertDescription className="font-normal">Reserva modificada correctamente</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="font-medium">
            Vehículo
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
                  {v.modelo} - {v.matricula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && <p className="text-red-500 text-xs font-normal mt-1">{errors.vehicleId}</p>}
        </div>

        <div>
          <Label className="font-medium">
            Plaza
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
          {errors.plazaId && <p className="text-red-500 text-xs font-normal mt-1">{errors.plazaId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="font-medium">
            Inicio
          </Label>
          <Input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            disabled={isLoading || submitting}
            className={`w-full ${errors.startTime || errors.ahead ? "border-red-500" : ""}`}
            min={new Date(Date.now() + RESERVA_ANTICIPACION_MIN * 60 * 1000).toISOString().slice(0,16)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 16)}
          />
          {errors.startTime && <p className="text-red-500 text-xs font-normal mt-1">{errors.startTime}</p>}
          {errors.ahead && <p className="text-red-500 text-xs font-normal mt-1">{errors.ahead}</p>}
        </div>
        <div>
          <Label className="font-medium">
            Fin
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
                ? new Date(new Date(form.startTime).getTime() + RESERVA_TIEMPO_MIN * 60 * 1000).toISOString().slice(0,16)
                : undefined
            }
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().slice(0, 16)}
          />
          {errors.endTime && <p className="text-red-500 text-xs font-normal mt-1">{errors.endTime}</p>}
          {errors.duration && <p className="text-red-500 text-xs font-normal mt-1">{errors.duration}</p>}
        </div>
      </div>

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
