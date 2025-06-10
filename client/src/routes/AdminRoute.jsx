import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function AdminRoute({ children }) {
  const { user, isAuthenticated, isAuthChecked } = useAuth()

  // Si aún no se ha verificado la autenticación, mostramos un loading
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
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
