import React from 'react'
import Plaza from './Plaza'

const Planta = ({ planta, onSelectPlaza, plazasActualizadas = [] }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {planta.plazas.map(plaza => {
          // Verificar si esta plaza fue actualizada recientemente por socket
          const plazaActualizada = plazasActualizadas.find(p => p.id === plaza.id)
          const isUpdatedBySocket = plazaActualizada &&
            (Date.now() - new Date(plazaActualizada.timestamp).getTime()) < 3000 // Últimos 3 segundos

          return (
            <Plaza
              key={plaza.id}
              plaza={plaza}
              onSelect={() => onSelectPlaza(plaza)}
              isUpdatedBySocket={isUpdatedBySocket}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Planta
