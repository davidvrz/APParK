import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useReserva } from "@/hooks/useReserva"
import ReservaHistorialCard from "./ReservaHistorialCard"

export default function HistorialReservas({ isEmbedded = false }) {
  const { historial = [], loading } = useReserva()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef(null)

  useEffect(() => {
    if (historial.length > 0 && currentIndex >= historial.length) {
      setCurrentIndex(historial.length - 1)
    } else if (historial.length === 0) {
      setCurrentIndex(0)
    }
  }, [historial, currentIndex])

  const nextCard = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % historial.length)
  }

  const prevCard = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + historial.length) % historial.length)
  }

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset > 100 || velocity > 500) {
      prevCard()
    } else if (offset < -100 || velocity < -500) {
      nextCard()
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

  const current = historial && historial.length > 0 ? historial[currentIndex] : null

  const reservationsContent = (
    <>
      {loading && (!historial || historial.length === 0) ? (
        <div className="h-[350px] flex items-center justify-center">
          <div className="rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-100 animate-spin"></div>
        </div>
      ) : !loading && (!historial || historial.length === 0) ? (
        <div className="h-[350px] flex flex-col items-center justify-center text-center px-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-display font-medium tracking-tight mb-2">Aún no tienes reservas pasadas</h3>
          <p className="text-gray-500 dark:text-gray-400 font-normal mb-4">
            Cuando realices una reserva y se complete, aparecerá aquí tu historial.
          </p>
          {!isEmbedded && (
            <Link to="/map">
              <Button className="font-medium">Crear Reserva</Button>
            </Link>
          )}
        </div>
      ) : current ? (
        <div className="flex justify-center items-center h-[380px] px-8" ref={constraintsRef}>
          <div className="relative w-full h-full flex justify-center items-center perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
                <ReservaHistorialCard reservation={current} />
              </motion.div>
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

            {historial.length > 1 && (
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center space-x-2 z-20">
                {historial.slice(0, 10).map((_, index) => (
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
            )}
          </div>
        </div>
      ) : null}
    </>
  )

  if (isEmbedded) {
    return reservationsContent
  }

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
              <span className="sm:hidden">{historial.length}</span>
              <span className="hidden sm:inline">{historial.length} Reservas</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-8 relative">
        {reservationsContent}
      </CardContent>
    </Card>
  )
}
