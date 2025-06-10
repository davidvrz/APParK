import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { useParking } from "@/hooks/useParking"
import ParkingCard from "@/components/admin/ParkingCard"
import ParkingFormModal from "@/components/admin/ParkingFormModal"
import ParkingDetailsModal from "@/components/admin/ParkingDetailsModal"

function ParkingsPage() {
  const { parkings, loading, error } = useParking()

  const [searchTerm, setSearchTerm] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedParking, setSelectedParking] = useState(null)
  const [editingParking, setEditingParking] = useState(null)

  const handleViewParking = (parking) => {
    setSelectedParking(parking)
    setIsDetailsModalOpen(true)
  }

  const handleEditParking = (parking) => {
    setEditingParking(parking)
    setIsFormModalOpen(true)
  }

  const handleModalClose = () => {
    setIsFormModalOpen(false)
    setIsDetailsModalOpen(false)
    setSelectedParking(null)
    setEditingParking(null)
  }

  const handleSuccess = () => {
    handleModalClose()
  }

  const filteredParkings = parkings.filter(parking =>
    parking.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parking.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gestión de Parkings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administra todos los parkings del sistema
          </p>
        </div>
        <Button
          onClick={() => setIsFormModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Parking
        </Button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar parkings por nombre o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredParkings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-6" />
              <h2 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No se encontraron parkings' : 'No hay parkings'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza creando tu primer parking'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsFormModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Parking
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">            {filteredParkings.map((parking) => (
            <ParkingCard
              key={parking.id}
              parking={parking}
              onView={() => handleViewParking(parking)}
              onEdit={() => handleEditParking(parking)}
            />
          ))}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <ParkingFormModal
        isOpen={isFormModalOpen}
        onClose={handleModalClose}
        parking={editingParking}
        onSuccess={handleSuccess}
      />

      <ParkingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        parking={selectedParking}
        onEdit={() => {
          setEditingParking(selectedParking)
          setIsDetailsModalOpen(false)
          setIsFormModalOpen(true)
        }}
      />
    </div>
  )
}

export default ParkingsPage
