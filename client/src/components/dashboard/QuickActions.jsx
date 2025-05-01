import { motion } from "framer-motion";
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
      description: "Reservar plaza"
    },
    {
      icon: Clock,
      label: "Extender Tiempo",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300",
      link: "/parking/details",
      description: "Prolongar estancia"
    },
    {
      icon: Car,
      label: "Mis Vehículos",
      color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300",
      link: "/cars",
      description: "Gestionar coches"
    },
    {
      icon: History,
      label: "Historial",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300",
      link: "/parking/history",
      description: "Ver reservas pasadas"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5 h-full">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.06,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)"
          }}
          className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden h-full border border-gray-100 dark:border-gray-700"
        >
          <Link to={action.link} className="h-full">
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col items-center justify-center p-5 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mb-4 shadow-md`}>
                <action.icon className="h-7 w-7" />
              </div>
              <span className="font-medium text-lg mb-1">{action.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{action.description}</span>
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
