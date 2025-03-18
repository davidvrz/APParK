import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64), // 👈 Máximo 64 caracteres (para seguridad)
  nombreCompleto: z.string().max(100),
  telefono: z.string()
    .min(9)
    .max(15)
    .regex(/^\d+$/, 'El teléfono solo debe contener números') // 👈 Solo números permitidos
    .optional(),
  rol: z.enum(['admin', 'conductor'])
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64) // 👈 Limitar longitud
})
