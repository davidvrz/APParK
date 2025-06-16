import React from 'react'
import Plaza from './Plaza'

const Planta = ({ planta, onSelectPlaza, reservaData = {} }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {planta.plazas.map(plaza => {
          return (
            <Plaza
              key={plaza.id}
              plaza={plaza}
              onSelect={() => onSelectPlaza(plaza)}
              reservaData={reservaData}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Planta
