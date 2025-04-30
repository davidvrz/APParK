import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Clock, Car, History } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  const actions = [
    {
      icon: PlusCircle,
      label: "Nueva Reserva",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300",
      link: "/map",
    },
    {
      icon: Clock,
      label: "Extender Tiempo",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300",
      link: "/parking/details",
    },
    {
      icon: Car,
      label: "Mis Vehículos",
      color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
      link: "/cars",
    },
    {
      icon: History,
      label: "Historial",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300",
      link: "/parking/history",
    },
  ];

  return (
    <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm border-none shadow-lg dark:bg-gray-800/60">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Accesos directos a funciones comunes</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={action.link}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center p-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">{action.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
