import { z } from 'zod'

export const plantaSchema = z.object({
  parking_id: z.number()
    .int('El ID del parking debe ser un entero positivo')
    .positive('El ID del parking debe ser válido'),

  numero: z.number()
    .int('El número de planta debe ser un entero')
    .nonnegative('El número de planta no puede ser negativo')
})
