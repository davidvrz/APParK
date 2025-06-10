import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/Switch"
import { useParking } from "@/hooks/useParking"
import { toast } from "sonner"

function AnuncioFormModal({ isOpen, onClose, parkingId, anuncio, onSuccess }) {
  const { createAnuncio, updateAnuncio } = useParking()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'informativo',
    activo: true,
    fechaExpiracion: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEdit = !!anuncio

  useEffect(() => {
    if (isOpen) {
      if (anuncio) {
        setFormData({
          titulo: anuncio.titulo || '',
          descripcion: anuncio.descripcion || '',
          tipo: anuncio.tipo || 'informativo',
          activo: anuncio.activo ?? true,
          fechaExpiracion: anuncio.fechaExpiracion ?
            new Date(anuncio.fechaExpiracion).toISOString().split('T')[0] : ''
        })
      } else {
        setFormData({
          titulo: '',
          descripcion: '',
          tipo: 'informativo',
          activo: true,
          fechaExpiracion: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, anuncio])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    }

    if (formData.fechaExpiracion) {
      const expDate = new Date(formData.fechaExpiracion)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (expDate < today) {
        newErrors.fechaExpiracion = 'La fecha de expiración debe ser futura'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      const submitData = {
        ...formData,
        fechaExpiracion: formData.fechaExpiracion || undefined
      }

      if (isEdit) {
        await updateAnuncio(parkingId, anuncio._id, submitData)
        toast.success('Anuncio actualizado correctamente')
      } else {
        await createAnuncio(parkingId, submitData)
        toast.success('Anuncio creado correctamente')
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving anuncio:', error)
      toast.error(error.response?.data?.message || 'Error al guardar el anuncio')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Editar Anuncio' : 'Nuevo Anuncio'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ingresa el título del anuncio"
                className={errors.titulo ? 'border-red-500' : ''}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500">{errors.titulo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe el contenido del anuncio"
                rows={4}
                className={errors.descripcion ? 'border-red-500' : ''}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Anuncio</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="promocion">Promoción</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaExpiracion">Fecha de Expiración (Opcional)</Label>
              <Input
                id="fechaExpiracion"
                type="date"
                value={formData.fechaExpiracion}
                onChange={(e) => handleInputChange('fechaExpiracion', e.target.value)}
                className={errors.fechaExpiracion ? 'border-red-500' : ''}
              />
              {errors.fechaExpiracion && (
                <p className="text-sm text-red-500">{errors.fechaExpiracion}</p>
              )}
              <p className="text-sm text-gray-500">
                Si no se especifica, el anuncio no expirará automáticamente
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="activo" className="text-sm font-medium">
                Anuncio Activo
              </Label>
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => handleInputChange('activo', checked)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  isEdit ? 'Actualizar' : 'Crear'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AnuncioFormModal
