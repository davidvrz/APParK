import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Plus, Trash2, Building2, Car, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

// Componente para cada plaza individual
const PlazaCard = ({ plaza, plazaIndex, plantaIndex, onRemove, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const plazaId = `${plantaIndex}-${plazaIndex}`

  const getTipoColor = (tipo) => {
    const colors = {
      'Coche': 'bg-blue-100 text-blue-800',
      'Moto': 'bg-green-100 text-green-800',
      'Especial': 'bg-purple-100 text-purple-800',
      'Eléctrico': 'bg-yellow-100 text-yellow-800',
      'Discapacitados': 'bg-orange-100 text-orange-800',
      'VIP': 'bg-red-100 text-red-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="border rounded-lg overflow-hidden h-fit">
      {/* Header compacto */}
      <div
        className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors min-h-[60px] flex flex-col justify-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-medium text-sm whitespace-nowrap">Plaza {plaza.numero}</span>
            <Badge variant="outline" className={`text-xs flex-shrink-0 ${getTipoColor(plaza.tipo)}`}>
              <span className="truncate max-w-14" title={plaza.tipo}>
                {plaza.tipo}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(plantaIndex, plazaIndex)
              }}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </div>
        </div>

        {/* Info compacta cuando está cerrado */}
        {!isExpanded && (
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>€{plaza.precioHora}/h</span>
            {plaza.reservable && <span className="text-green-600">• Reservable</span>}
          </div>
        )}
      </div>

      {/* Panel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t bg-white space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo</Label>
                  <Select
                    value={plaza.tipo}
                    onValueChange={(value) => onUpdate(plantaIndex, plazaIndex, 'tipo', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Coche">Coche</SelectItem>
                      <SelectItem value="Moto">Moto</SelectItem>
                      <SelectItem value="Especial">Especial</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="Discapacitados">Discapacitados</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">€/hora </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={plaza.precioHora}
                    onChange={(e) => onUpdate(plantaIndex, plazaIndex, 'precioHora', parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`reservable-${plantaIndex}-${plazaIndex}`}
                  checked={plaza.reservable}
                  onChange={(e) => onUpdate(plantaIndex, plazaIndex, 'reservable', e.target.checked)}
                  className="h-3 w-3"
                />
                <Label htmlFor={`reservable-${plantaIndex}-${plazaIndex}`} className="text-xs">
                  Plaza reservable
                </Label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ParkingFormModal = ({ isOpen, onClose, parking = null, createParking, updateParking, }) => {
  const [loading, setLoading] = useState(false)
  const isEditing = !!parking

  // Estado inicial
  const getInitialFormData = () => ({
    nombre: '',
    ubicacion: '',
    latitud: '',
    longitud: '',
    capacidad: '',
    estado: 'Operativo',
    plantas: []
  })

  const [formData, setFormData] = useState(getInitialFormData())
  const [errors, setErrors] = useState({})

  // Efecto para resetear o cargar datos cuando cambia el modal
  useEffect(() => {
    if (isOpen) {
      if (parking) {
        // Si estamos editando, cargar datos del parking
        setFormData({
          nombre: parking.nombre || '',
          ubicacion: parking.ubicacion || '',
          latitud: parking.latitud || '',
          longitud: parking.longitud || '',
          capacidad: parking.capacidad || '',
          estado: parking.estado || 'Operativo',
          plantas: parking.plantas || []
        })
      } else {
        // Si estamos creando, usar datos limpios
        setFormData(getInitialFormData())
      }
      // Limpiar errores
      setErrors({})
    }
  }, [isOpen, parking])

  // Función para cerrar y limpiar
  const handleClose = () => {
    setFormData(getInitialFormData())
    setErrors({})
    setLoading(false)
    onClose()
  }

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

      handleClose()

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

  const updatePlaza = (plantaIndex, plazaIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.map((planta, i) =>
        i === plantaIndex
          ? {
            ...planta,
            plazas: planta.plazas.map((plaza, j) =>
              j === plazaIndex ? { ...plaza, [field]: value } : plaza
            )
          }
          : planta
      )
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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

          {/* Sección de plantas y plazas */}
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
                            <PlazaCard
                              key={`${plantaIndex}-${plazaIndex}`}
                              plaza={plaza}
                              plazaIndex={plazaIndex}
                              plantaIndex={plantaIndex}
                              onRemove={removePlaza}
                              onUpdate={updatePlaza}
                            />
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
                    No hay plantas configuradas. {isEditing ? 'Puedes agregar plantas y plazas.' : 'Agregar plantas y plazas es opcional durante la creación.'}
                  </p>
                  {!isEditing && (
                    <p className="text-sm text-gray-400 mt-1">
                      Puedes configurarlas más tarde desde la vista de detalle.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
