import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

export default function VehicleForm({ vehicle = null, onSubmit, isSubmitting = false, error = null }) {
  const [formData, setFormData] = useState({
    matricula: "",
    modelo: "",
    tipo: ""
  })

  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!vehicle) return

    setFormData({
      matricula: vehicle.matricula || "",
      modelo: vehicle.modelo || "",
      tipo: vehicle.tipo || ""
    })

    setValidationErrors({})
  }, [vehicle])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, tipo: value }))

    if (validationErrors.tipo) {
      setValidationErrors(prev => ({ ...prev, tipo: undefined }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.matricula || formData.matricula.trim() === '') {
      errors.matricula = "La matrícula es obligatoria"
    } else {
      const normalizedMatricula = formData.matricula.trim().toUpperCase()
      if (normalizedMatricula.length < 7 || normalizedMatricula.length > 10) {
        errors.matricula = "La matrícula debe tener entre 7 y 10 caracteres"
      }
      else if (!normalizedMatricula.match(/^[A-Z0-9]+$/)) {
        errors.matricula = "La matrícula solo puede contener letras y números"
      }
    }

    if (!formData.modelo || formData.modelo.trim() === '') {
      errors.modelo = "El modelo es obligatorio"
    } else if (formData.modelo.trim().length < 2) {
      errors.modelo = "El modelo debe tener al menos 2 caracteres"
    }

    if (!formData.tipo) {
      errors.tipo = "El tipo de vehículo es obligatorio"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="font-normal">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="matricula" className="font-medium">
          Matrícula
        </Label>
        <Input
          id="matricula"
          name="matricula"
          placeholder="Ejemplo: 1234ABC"
          value={formData.matricula}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {validationErrors.matricula && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.matricula}</p>
        )}
      </div>
      <div className="space-y-2 pt-2">
        <Label htmlFor="modelo" className="font-medium">
          Modelo
        </Label>
        <Input
          id="modelo"
          name="modelo"
          placeholder="Ejemplo: Seat Ibiza, Honda CBR..."
          value={formData.modelo}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        {validationErrors.modelo && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.modelo}</p>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="tipo" className="font-medium">
          Tipo de vehículo
        </Label>
        {(vehicle === null || formData.tipo) && (
          <Select
            value={formData.tipo}
            onValueChange={handleSelectChange}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Coche">Coche</SelectItem>
              <SelectItem value="Moto">Moto</SelectItem>
              <SelectItem value="Especial">Especial</SelectItem>
              <SelectItem value="Electrico">Eléctrico</SelectItem>
              <SelectItem value="Discapacitados">Discapacitados</SelectItem>
            </SelectContent>
          </Select>
        )}
        {validationErrors.tipo && (
          <p className="text-sm text-red-500 mt-1">{validationErrors.tipo}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full font-medium mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {vehicle ? "Actualizando..." : "Guardando..."}
          </>
        ) : vehicle ? "Actualizar Vehículo" : "Guardar Vehículo"}
      </Button>
    </form>
  )
}