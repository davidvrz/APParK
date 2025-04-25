import { Outlet } from 'react-router-dom'
import HeaderBar from '../components/layout/HeaderBar'

function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Header siempre visible */}
      <HeaderBar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
