import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Megaphone,
  AlertCircle,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { toast } from "sonner"
import { useParking } from "@/hooks/useParking"
import AnuncioFormModal from "./AnuncioFormModal"

const AnunciosListModal = ({ isOpen, onClose, parking }) => {
  const { fetchAnuncios, deleteAnuncio } = useParking()
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anuncioToDelete, setAnuncioToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadAnuncios = useCallback(async () => {
    if (!parking?.id) return

    setLoading(true)
    try {
      const anunciosData = await fetchAnuncios(parking.id)
      setAnuncios(anunciosData || [])
    } catch (error) {
      console.error('Error al cargar anuncios:', error)
      toast.error('Error al cargar los anuncios')
    } finally {
      setLoading(false)
    }
  }, [parking?.id, fetchAnuncios])

  useEffect(() => {
    if (isOpen && parking) {
      loadAnuncios()
      setSearchTerm("")
    }
  }, [isOpen, parking, loadAnuncios])

  const handleNewAnuncio = () => {
    setEditingAnuncio(null)
    setIsFormModalOpen(true)
  }
  const handleEditAnuncio = (anuncio) => {
    setEditingAnuncio(anuncio)
    setIsFormModalOpen(true)
  }
  const handleDeleteAnuncio = async (anuncio) => {
    setAnuncioToDelete(anuncio)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!anuncioToDelete) return

    setIsDeleting(true)
    try {
      await deleteAnuncio(parking.id, anuncioToDelete.id)
      toast.success('Anuncio eliminado correctamente')
      loadAnuncios()
      setDeleteDialogOpen(false)
      setAnuncioToDelete(null)
    } catch (error) {
      console.error('Error al eliminar anuncio:', error)
      toast.error('Error al eliminar el anuncio')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormSuccess = () => {
    setIsFormModalOpen(false)
    setEditingAnuncio(null)
    loadAnuncios()
  }

  const handleFormClose = () => {
    setIsFormModalOpen(false)
    setEditingAnuncio(null)
  }

  const filteredAnuncios = anuncios.filter(anuncio =>
    anuncio.contenido?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!parking) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Anuncios de {parking.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="p-1 flex-1 flex flex-col overflow-hidden space-y-4">
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar anuncios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleNewAnuncio}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                Nuevo Anuncio
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : anuncios.length === 0 && searchTerm === "" ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">No hay anuncios</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Comienza creando el primer anuncio para este parking
                    </p>
                    <Button onClick={handleNewAnuncio}>
                      <Plus className="h-4 w-4 mr-2" />
                    Crear Anuncio
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredAnuncios.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">No se encontraron anuncios</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Intenta con otros términos de búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredAnuncios.map((anuncio) => (
                      <motion.div
                        key={anuncio.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge
                                    variant="default"
                                    className="flex-shrink-0"
                                  >
                                    Anuncio
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {anuncio.contenido}
                                  </p>
                                </div>

                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                  <span>
                                    Creado: {new Date(anuncio.created_at).toLocaleDateString()}
                                  </span>
                                  {anuncio.updated_at !== anuncio.created_at && (
                                    <span>
                                      Actualizado: {new Date(anuncio.updated_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAnuncio(anuncio)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAnuncio(anuncio)}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* Footer con estadísticas */}
            {anuncios.length > 0 && (
              <div className="flex-shrink-0 pt-4 border-t">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    {filteredAnuncios.length} de {anuncios.length} anuncios
                  </span>
                  <span>
                    Total: {anuncios.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de formulario de anuncio */}
      <AnuncioFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormClose}
        parkingId={parking?.id}
        anuncio={editingAnuncio}
        onSuccess={handleFormSuccess}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600 font-semibold">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Eliminar Anuncio
            </DialogTitle>
            <DialogDescription className="font-normal text-gray-600 dark:text-gray-400">
              Esta acción no se puede deshacer
            </DialogDescription>
          </DialogHeader>

          {/* Información del anuncio a eliminar */}
          {anuncioToDelete && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">
                    Anuncio de {parking?.nombre}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 line-clamp-2">
                    {anuncioToDelete.contenido}
                  </p>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Creado: {new Date(anuncioToDelete.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setAnuncioToDelete(null)
              }}
              disabled={isDeleting}
              className="text-sm"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-sm min-w-[100px]"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Eliminando...
                </div>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AnunciosListModal
