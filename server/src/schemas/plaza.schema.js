import { z } from 'zod'

export const plazaSchema = z.object({
  planta_id: z.number()
    .int('El ID de la planta debe ser un entero positivo')
    .positive('El ID de la planta debe ser válido'),

  numero: z.number()
    .int('El número de plaza debe ser un entero positivo')
    .positive('El número de plaza debe ser mayor que 0'),

  tipo: z.enum(['Coche', 'Moto', 'Especial', 'Electrico', 'Discapacitados', 'VIP']),

  estado: z.enum(['Libre', 'Ocupado', 'Reservado']).optional(),

  precioHora: z.number()
    .positive('El precio por hora debe ser mayor que 0')
})
