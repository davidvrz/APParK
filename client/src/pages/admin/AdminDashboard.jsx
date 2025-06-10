import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Settings, Database, Activity, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useParking } from "@/hooks/useParking"
import { useProfile } from "@/hooks/useProfile"

function AdminDashboard() {
  const navigate = useNavigate()
  const { parkings } = useParking()
  const { users } = useProfile()

  const stats = [
    {
      title: "Total Parkings",
      value: parkings.length.toString(),
      icon: <Database className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-600",
      change: `${parkings.length} parkings configurados`
    },
    {
      title: "Usuarios Registrados",
      value: users.length.toString(),
      icon: <Users className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
      change: `${users.filter(u => u.activo).length} activos`
    },
    {
      title: "Reservas Hoy",
      value: "0",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-purple-500 to-pink-600",
      change: "Sistema funcionando"
    },
    {
      title: "Alertas Activas",
      value: "0",
      icon: <AlertCircle className="h-6 w-6" />,
      color: "from-red-500 to-orange-600",
      change: "Todo OK"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona y monitorea el sistema APParK
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/parkings')}
              >
                <Database className="h-6 w-6 text-blue-500 mb-2" />
                <h3 className="font-semibold">Gestionar Parkings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crear, editar y configurar parkings ({parkings.length} total)
                </p>
              </motion.button>

              <motion.button
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/eventos')}
              >
                <Activity className="h-6 w-6 text-green-500 mb-2" />
                <h3 className="font-semibold">Ver Eventos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitorear actividad del sistema en tiempo real
                </p>
              </motion.button>

              <motion.button
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/usuarios')}
              >
                <Users className="h-6 w-6 text-purple-500 mb-2" />
                <h3 className="font-semibold">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Administrar cuentas de usuario ({users.length} total)
                </p>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sistema Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Base de Datos</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operativo</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">API Principal</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operativo</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Sistema de Reservas</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Operativo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
