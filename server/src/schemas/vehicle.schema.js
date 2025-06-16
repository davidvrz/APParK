import { z } from 'zod'

export const vehicleSchema = z.object({
  matricula: z.string()
    .min(7, 'La matrícula debe tener al menos 7 caracteres')
    .max(10, 'La matrícula debe tener como máximo 10 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Formato de matrícula inválido. Use solo letras mayúsculas y números.'),
  modelo: z.string()
    .min(2, 'El modelo debe tener al menos 2 caracteres')
    .max(50, 'El modelo debe tener como máximo 50 caracteres'),
  tipo: z.enum(['Coche', 'Moto', 'Especial', 'Electrico', 'Discapacitados'])
})
