import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Vehiculos from '../pages/Vehiculos'
import Map from '../pages/Map'
import Perfil from '../pages/Perfil'
import HistorialReservasPage from '../pages/reservas/HistorialReservasPage'
import ReservasActivasPage from '../pages/reservas/ReservasActivasPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ParkingsPage from '../pages/admin/ParkingsPage'
import EventosPage from '../pages/admin/EventosPage'
import UsuariosPage from '../pages/admin/UsuariosPage'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import NotFound from '../pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas de admin */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="parkings" element={<ParkingsPage />} />
        <Route path="eventos" element={<EventosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
      </Route>

      {/* Rutas de usuario */}
      <Route element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/map" element={<Map />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reservas/historial" element={<HistorialReservasPage />} />
        <Route path="/reservas/activas" element={<ReservasActivasPage />} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
