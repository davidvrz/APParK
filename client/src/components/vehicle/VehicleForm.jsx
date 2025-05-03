import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/Select"

/**
 * Componente de formulario para añadir o editar un vehículo.
 *
 * @param {Object} vehicle - Vehículo a editar (opcional, si es undefined se trata como nuevo vehículo)
 * @param {Function} onSubmit - Función que se ejecuta al enviar el formulario
 * @param {boolean} isSubmitting - Indica si el formulario está siendo enviado
 * @param {string} error - Error del formulario si existe
 */
export default function VehicleForm({ vehicle, onSubmit, isSubmitting = false, error = null }) {
  const [formData, setFormData] = useState({
    matricula: "",
    modelo: "",
    tipo: ""
  })

  const [validationErrors, setValidationErrors] = useState({})

  // Si se proporciona un vehículo, inicializamos el formulario con sus datos
  useEffect(() => {
    if (vehicle) {
      setFormData({
        matricula: vehicle.matricula || "",
        modelo: vehicle.modelo || "",
        tipo: vehicle.tipo || ""
      })
    }
  }, [vehicle])

  // Maneja cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Eliminar el error de validación cuando el usuario edita el campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Maneja cambios en el select de tipo
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, tipo: value }))

    if (validationErrors.tipo) {
      setValidationErrors(prev => ({ ...prev, tipo: undefined }))
    }
  }

  // Valida el formulario antes de enviar
  const validateForm = () => {
    const errors = {}

    if (!formData.matricula) {
      errors.matricula = "La matrícula es obligatoria"
    } else if (!formData.matricula.match(/^[A-Z0-9]+$/)) {
      errors.matricula = "Formato de matrícula inválido. Use solo letras mayúsculas y números"
    }

    if (!formData.tipo) {
      errors.tipo = "El tipo de vehículo es obligatorio"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Maneja el envío del formulario
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
        <Label htmlFor="matricula" className={validationErrors.matricula ? "text-red-500 font-medium" : "font-medium"}>
          Matrícula {validationErrors.matricula && `(${validationErrors.matricula})`}
        </Label>
        <Input
          id="matricula"
          name="matricula"
          placeholder="Ejemplo: 1234ABC"
          value={formData.matricula}
          onChange={handleInputChange}
          className={validationErrors.matricula ? "border-red-500 mt-1" : "mt-1"}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="modelo" className="font-medium">
          Modelo (opcional)
        </Label>
        <Input
          id="modelo"
          name="modelo"
          placeholder="Ejemplo: Seat Ibiza, Honda CBR..."
          value={formData.modelo}
          onChange={handleInputChange}
          className="mt-1"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="tipo" className={validationErrors.tipo ? "text-red-500 font-medium" : "font-medium"}>
          Tipo de vehículo {validationErrors.tipo && `(${validationErrors.tipo})`}
        </Label>
        <Select
          value={formData.tipo}
          onValueChange={handleSelectChange}
          disabled={isSubmitting}
        >
          <SelectTrigger className={validationErrors.tipo ? "border-red-500 mt-1" : "mt-1"}>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Coche">Coche</SelectItem>
            <SelectItem value="Moto">Moto</SelectItem>
            <SelectItem value="Especial">Especial</SelectItem>
          </SelectContent>
        </Select>
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