import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"

export default function ReservaEditForm({ reserva, vehiculos, plazasDisponibles, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    vehicleId: reserva.vehiculo_id,
    plazaId: reserva.plaza_id,
    startTime: new Date(reserva.startTime),
    endTime: new Date(reserva.endTime),
  })

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Vehículo */}
        <div className="space-y-2">
          <Label>Vehículo</Label>
          <Select defaultValue={formData.vehicleId} onValueChange={handleChange("vehicleId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un vehículo" />
            </SelectTrigger>
            <SelectContent>
              {vehiculos.map((vehiculo) => (
                <SelectItem key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.matricula}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plaza */}
        <div className="space-y-2">
          <Label>Plaza</Label>
          <Select defaultValue={formData.plazaId} onValueChange={handleChange("plazaId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una plaza" />
            </SelectTrigger>
            <SelectContent>
              {plazasDisponibles.map((plaza) => (
                <SelectItem key={plaza.id} value={plaza.id}>
                  Plaza {plaza.numero} - Planta {plaza.planta?.numero} ({plaza.tipo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha y hora de inicio */}
        <div className="space-y-2">
          <Label>Inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.startTime && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startTime ? format(formData.startTime, "dd MMM yyyy HH:mm", { locale: es }) : "Selecciona inicio"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startTime}
                onSelect={(date) => date && handleChange("startTime")(new Date(date.setHours(formData.startTime.getHours(), formData.startTime.getMinutes())))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha y hora de fin */}
        <div className="space-y-2">
          <Label>Fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.endTime && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endTime ? format(formData.endTime, "dd MMM yyyy HH:mm", { locale: es }) : "Selecciona fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endTime}
                onSelect={(date) => date && handleChange("endTime")(new Date(date.setHours(formData.endTime.getHours(), formData.endTime.getMinutes())))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
