import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

function AdminRoute({ children }) {
  const { user, isAuthenticated, isAuthChecked } = useAuth()

  // Si aún no se ha verificado la autenticación, mostramos un loading
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si no es admin, redirigir al dashboard de usuario
  if (user.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
