import { z } from 'zod'

export const anuncioSchema = z.object({
  contenido: z
    .string({ required_error: 'El contenido del anuncio es obligatorio' })
    .min(5, 'El anuncio debe tener al menos 5 caracteres')
    .max(500, 'El anuncio no puede superar los 500 caracteres')
})
