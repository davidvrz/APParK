import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './store/AuthContext'
import App from './App'
import './styles/index.css'
import "leaflet/dist/leaflet.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
