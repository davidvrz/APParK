import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, MapPin, Car, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useReservas } from "@/hooks/useReservas";

function HistorialReservas() {
  const { historial = [] } = useReservas();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef(null);

  const nextCard = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % historial.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + historial.length) % historial.length);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -100) {
      nextCard();
    } else if (info.offset.x > 100) {
      prevCard();
    }
  };

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
  };

  const current = historial[currentIndex];

  return (
    <Card className="min-h-[500px] h-full overflow-hidden bg-white/80 backdrop-blur-sm border-none shadow-lg dark:bg-gray-800/60">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Historial de Reservas</CardTitle>
          <Badge variant="outline" className="text-white border-white">{historial.length} Reservas</Badge>
        </div>
        <CardDescription className="text-purple-100">Tus reservas anteriores</CardDescription>
      </CardHeader>

      <CardContent className="p-4 relative">
        {historial.length === 0 ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-center px-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aún no tienes reservas pasadas</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Cuando realices una reserva y se complete, aparecerá aquí tu historial.
            </p>
            <Button>Crear Reserva</Button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[350px] px-8" ref={constraintsRef}>
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
                    <Card className="w-full h-full overflow-hidden border shadow-lg">
                      <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{current.parking?.nombre || "Parking"}</h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{current.parking?.ubicacion || "Ubicación no disponible"}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{current.precioTotal ? `${current.precioTotal}€` : "Precio N/D"}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Entrada</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1 text-purple-500" />
                              <span className="font-medium">{current.startTime}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Salida</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1 text-purple-500" />
                              <span className="font-medium">{current.endTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <Car className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">{current.vehicle?.matricula || "Vehículo"}</span>
                        </div>

                        <div className="mt-auto pt-4 flex justify-center pb-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver detalles completos
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md z-20"
                onClick={prevCard}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md z-20"
                onClick={nextCard}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1 z-20">
                {historial.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 dark:bg-gray-800/80 border-t flex justify-center items-center">
        <Button variant="link" size="sm">Ver historial completo</Button>
      </CardFooter>
    </Card>
  );
}

export default HistorialReservas;
