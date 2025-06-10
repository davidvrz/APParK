import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Building2, Car } from "lucide-react"
import { useParking } from "@/hooks/useParking"
import { toast } from "sonner"

const ParkingFormModal = ({
  isOpen,
  onClose,
  parking = null,
  onSuccess
}) => {
  const { createParking, updateParking } = useParking()
  const [loading, setLoading] = useState(false)
  const isEditing = !!parking

  const [formData, setFormData] = useState({
    nombre: parking?.nombre || '',
    ubicacion: parking?.ubicacion || '',
    latitud: parking?.latitud || '',
    longitud: parking?.longitud || '',
    capacidad: parking?.capacidad || '',
    estado: parking?.estado || 'Operativo',
    plantas: parking?.plantas || []
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida'
    }

    if (!formData.latitud || isNaN(formData.latitud)) {
      newErrors.latitud = 'La latitud debe ser un número válido'
    }

    if (!formData.longitud || isNaN(formData.longitud)) {
      newErrors.longitud = 'La longitud debe ser un número válido'
    }

    if (!formData.capacidad || isNaN(formData.capacidad) || formData.capacidad <= 0) {
      newErrors.capacidad = 'La capacidad debe ser un número mayor a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    try {
      setLoading(true)

      const submitData = {
        ...formData,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        capacidad: parseInt(formData.capacidad)
      }

      if (isEditing) {
        await updateParking(parking.id, submitData)
        toast.success('Parking actualizado correctamente')
      } else {
        await createParking(submitData)
        toast.success('Parking creado correctamente')
      }

      onSuccess()
      onClose()

      if (!isEditing) {
        setFormData({
          nombre: '',
          ubicacion: '',
          latitud: '',
          longitud: '',
          capacidad: '',
          estado: 'Operativo',
          plantas: []
        })
      }
    } catch (error) {
      console.error('Error al guardar parking:', error)
      toast.error(error.response?.data?.message || 'Error al guardar el parking')
    } finally {
      setLoading(false)
    }
  }

  const addPlanta = () => {
    const nuevaPlanta = {
      numero: formData.plantas.length + 1,
      plazas: []
    }

    setFormData(prev => ({
      ...prev,
      plantas: [...prev.plantas, nuevaPlanta]
    }))
  }

  const removePlanta = (index) => {
    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.filter((_, i) => i !== index)
    }))
  }

  const addPlaza = (plantaIndex) => {
    const nuevaPlaza = {
      numero: formData.plantas[plantaIndex].plazas.length + 1,
      tipo: 'Coche',
      estado: 'Libre',
      precioHora: 2.50,
      reservable: true
    }

    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.map((planta, i) =>
        i === plantaIndex
          ? { ...planta, plazas: [...planta.plazas, nuevaPlaza] }
          : planta
      )
    }))
  }

  const removePlaza = (plantaIndex, plazaIndex) => {
    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.map((planta, i) =>
        i === plantaIndex
          ? { ...planta, plazas: planta.plazas.filter((_, j) => j !== plazaIndex) }
          : planta
      )
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Parking' : 'Crear Nuevo Parking'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Nombre del parking"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operativo">Operativo</SelectItem>
                  <SelectItem value="Cerrado">Cerrado</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Textarea
                id="ubicacion"
                placeholder="Dirección completa del parking"
                value={formData.ubicacion}
                onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                className={errors.ubicacion ? 'border-red-500' : ''}
                rows={2}
              />
              {errors.ubicacion && (
                <p className="text-sm text-red-500">{errors.ubicacion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitud">Latitud *</Label>
              <Input
                id="latitud"
                type="number"
                step="any"
                placeholder="42.2406"
                value={formData.latitud}
                onChange={(e) => handleInputChange('latitud', e.target.value)}
                className={errors.latitud ? 'border-red-500' : ''}
              />
              {errors.latitud && (
                <p className="text-sm text-red-500">{errors.latitud}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitud">Longitud *</Label>
              <Input
                id="longitud"
                type="number"
                step="any"
                placeholder="-8.7225"
                value={formData.longitud}
                onChange={(e) => handleInputChange('longitud', e.target.value)}
                className={errors.longitud ? 'border-red-500' : ''}
              />
              {errors.longitud && (
                <p className="text-sm text-red-500">{errors.longitud}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad Total *</Label>
              <Input
                id="capacidad"
                type="number"
                placeholder="100"
                value={formData.capacidad}
                onChange={(e) => handleInputChange('capacidad', e.target.value)}
                className={errors.capacidad ? 'border-red-500' : ''}
              />
              {errors.capacidad && (
                <p className="text-sm text-red-500">{errors.capacidad}</p>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Plantas y Plazas</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPlanta}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Planta
                </Button>
              </div>

              <AnimatePresence>
                {formData.plantas.map((planta, plantaIndex) => (
                  <motion.div
                    key={plantaIndex}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Planta {planta.numero}</span>
                            <Badge variant="outline">
                              {planta.plazas.length} plazas
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addPlaza(plantaIndex)}
                            >
                              <Car className="h-3 w-3 mr-1" />
                              Plaza
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removePlanta(plantaIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {planta.plazas.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {planta.plazas.map((plaza, plazaIndex) => (
                              <div
                                key={plazaIndex}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                              >
                                <span className="text-sm">Plaza {plaza.numero}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePlaza(plantaIndex, plazaIndex)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.plantas.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No hay plantas configuradas. Agregar plantas y plazas es opcional durante la creación.
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Puedes configurarlas más tarde desde la vista de detalle.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ParkingFormModal
