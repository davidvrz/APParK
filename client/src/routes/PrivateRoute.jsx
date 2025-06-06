import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function PrivateRoute({ children }) {
  const { isAuthenticated, isAuthChecked } = useAuth()

  // Esperar a que se complete la comprobación del auth
  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated) {
    return children
  }

  return <Navigate to="/login" replace />
}

export default PrivateRoute
