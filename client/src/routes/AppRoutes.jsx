// src/router/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import PrivateRoute from './PrivateRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
