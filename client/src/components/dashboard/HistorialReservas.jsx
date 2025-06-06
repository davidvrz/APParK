import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Clock, MapPin, Car, ChevronLeft, ChevronRight, Calendar, Layers, Square } from "lucide-react"
import { useReservas } from "@/hooks/useReservas"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Link } from "react-router-dom"

// Funciones para formatear fechas y horas
function formatTime(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "HH:mm", { locale: es })
}

function formatShortDate(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "d MMM yyyy", { locale: es })
}

function HistorialReservas() {
  const { historial = [] } = useReservas()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef(null)

  const nextCard = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % historial.length)
  }

  const prevCard = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + historial.length) % historial.length)
  }

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      nextCard()
    } else if (info.offset.x > 100) {
      prevCard()
    }
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      rotateY: direction > 0 ? 15 : -15,
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
    }),
    center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      zIndex: 10,
      transition: {
        duration: 0.4,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      rotateY: direction < 0 ? 15 : -15,
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      transition: {
        duration: 0.4,
      },
    }),
  }

  const current = historial[currentIndex]

  return (
    <Card className="min-h-[500px] h-full overflow-hidden bg-white border-2 border-blue-200 dark:border-blue-900/30 shadow-sm dark:bg-gray-800/60">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-display text-xl font-semibold tracking-tight">Historial de Reservas</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 font-normal">Tus reservas anteriores</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/reservas/historial">
              <Button variant="link" size="sm" className="text-blue-500 font-medium">
                Ver completo
              </Button>
            </Link>
            <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 font-medium">
              {historial.length} Reservas
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pb-8 relative">
        {historial.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-center px-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-display font-medium tracking-tight mb-2">Aún no tienes reservas pasadas</h3>
            <p className="text-gray-500 dark:text-gray-400 font-normal mb-4">
              Cuando realices una reserva y se complete, aparecerá aquí tu historial.
            </p>
            <Link to="/map">
              <Button className="font-medium">Crear Reserva</Button>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[380px] px-8" ref={constraintsRef}>
            <div className="relative w-full h-full flex justify-center items-center perspective-1000">

              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                {current && (
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={constraintsRef}
                    onDragEnd={handleDragEnd}
                    className="absolute w-[85%] h-full cursor-grab active:cursor-grabbing"
                    style={{ zIndex: 10 }}
                  >
                    <Card className="w-full h-full overflow-hidden border shadow-lg bg-white dark:bg-gray-800">
                      <CardContent className="p-5 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-display text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
                              {current.parking?.nombre || "Parking"}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                              <span className="font-normal">{current.parking?.ubicacion || "Ubicación no disponible"}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">
                              {current.precioTotal ? `${current.precioTotal}€` : "Precio N/D"}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow">
                          {/* Vehículo */}
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
                            <Car className="h-6 w-6 mb-1 text-blue-500" />
                            <p className="text-base font-medium text-center leading-tight">{current.vehicle?.matricula || "Matrícula N/D"}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 text-center leading-tight">
                              {current.vehicle?.modelo || "Modelo N/D"}
                            </p>
                          </div>

                          {/* Ubicación */}
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <Square className="h-5 w-5 mb-0.5 text-blue-500" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Plaza</span>
                                <p className="text-base font-medium leading-tight">{current.plaza?.numero || "N/D"}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <Layers className="h-5 w-5 mb-0.5 text-blue-500" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">Planta</span>
                                <p className="text-base font-medium leading-tight">P{current.planta?.numero || current.plaza?.planta?.numero || "N/D"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Entrada */}
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
                            <Clock className="h-5 w-5 mb-0.5 text-blue-500" />
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">Entrada</span>
                            <p className="text-base font-medium leading-tight">{formatTime(current.startTime)}</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatShortDate(current.startTime)}</p>
                            </div>
                          </div>

                          {/* Salida */}
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg flex flex-col items-center justify-center">
                            <Clock className="h-5 w-5 mb-0.5 text-blue-500" />
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight">Salida</span>
                            <p className="text-base font-medium leading-tight">{formatTime(current.endTime)}</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{formatShortDate(current.endTime)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {historial.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-md z-20"
                    onClick={prevCard}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 h-10 w-10 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-md z-20"
                    onClick={nextCard}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Indicadores de navegación */}
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center space-x-2 z-20">
                {historial.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1)
                      setCurrentIndex(index)
                    }}
                    className={`h-2 w-${index === currentIndex ? '6' : '2'} rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                    }`}
                    aria-label={`Ver reserva ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HistorialReservas
