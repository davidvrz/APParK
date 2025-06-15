import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/Textarea"
import { useParking } from "@/hooks/useParking"
import { toast } from "sonner"

function AnuncioFormModal({ isOpen, onClose, parkingId, anuncio, onSuccess }) {
  const { createAnuncio, updateAnuncio } = useParking()
  const [formData, setFormData] = useState({
    contenido: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEdit = !!anuncio

  useEffect(() => {
    if (isOpen) {
      if (anuncio) {
        setFormData({
          contenido: anuncio.contenido || ''
        })
      } else {
        setFormData({
          contenido: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, anuncio])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.contenido.trim()) {
      newErrors.contenido = 'El contenido del anuncio es requerido'
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
        contenido: formData.contenido.trim()
      }

      if (isEdit) {
        await updateAnuncio(parkingId, anuncio.id, submitData)
        toast.success('Anuncio actualizado correctamente')
      } else {
        await createAnuncio(parkingId, submitData)
        toast.success('Anuncio creado correctamente')
      }

      onSuccess?.()
      onClose()
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Anuncio' : 'Nuevo Anuncio'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contenido">Contenido del Anuncio *</Label>
            <Textarea
              id="contenido"
              value={formData.contenido}
              onChange={(e) => handleInputChange('contenido', e.target.value)}
              placeholder="Escribe aquí el contenido del anuncio..."
              rows={6}
              className={errors.contenido ? 'border-red-500' : ''}
            />
            {errors.contenido && (
              <p className="text-sm text-red-500">{errors.contenido}</p>
            )}
            <p className="text-sm text-gray-500">
              Describe la información que quieres comunicar a los usuarios del parking
            </p>
          </div>

          <div className="flex gap-3 pt-4">
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
      </DialogContent>
    </Dialog>
  )
}

export default AnuncioFormModal
