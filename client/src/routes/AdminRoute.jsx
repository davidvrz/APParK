import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user.rol !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
