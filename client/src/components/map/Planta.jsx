import React from 'react'
import { Badge } from '@/components/ui/badge'
import Plaza from './Plaza'

const Planta = ({ planta, onSelectPlaza }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Planta {planta.numero}</h3>
        <Badge variant="outline" className="px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
          {planta.plazas.length} plazas
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {planta.plazas.map(plaza => (
          <Plaza
            key={plaza.id}
            plaza={plaza}
            onSelect={() => onSelectPlaza(plaza)}
          />
        ))}
      </div>
    </div>
  )
}

export default Planta
