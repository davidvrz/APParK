import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, ChevronRight } from "lucide-react";

export function Vehicles() {
  const [cars] = useState([
    {
      id: "car-001",
      brand: "Mercedes",
      model: "C 63",
      licensePlate: "A 63 DXB",
      color: "bg-blue-100",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "car-002",
      brand: "Tesla",
      model: "Model 3",
      licensePlate: "C 456 DXB",
      color: "bg-green-100",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]);

  return (
    <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm border-none shadow-lg dark:bg-gray-800/60">
      <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Mis Coches</CardTitle>
          <Badge variant="outline" className="text-white border-white">
            {cars.length}
          </Badge>
        </div>
        <CardDescription className="text-green-100">Vehículos registrados</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <a href="/cars" className="flex items-center">
                <div className={`${car.color} p-2 rounded-lg mr-3`}>
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{car.licensePlate}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 dark:bg-gray-800/80 border-t p-3">
        <Button size="sm" variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Vehículo
        </Button>
      </CardFooter>
    </Card>
  );
}
