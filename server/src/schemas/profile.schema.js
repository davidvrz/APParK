import { z } from 'zod'

export const profileSchema = z.object({
  nombreCompleto: z.string().max(100, 'Nombre demasiado largo').optional(),
  telefono: z.string().min(9, 'Teléfono muy corto').max(15, 'Teléfono demasiado largo').optional(),
  currentPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres').optional()
})
  .refine(data => {
    // Si se pasa una nueva contraseña, también debe pasarse la actual
    if (data.newPassword && !data.currentPassword) {
      return false
    }
    return true
  }, {
    message: 'Si deseas cambiar la contraseña, debes proporcionar la contraseña actual',
    path: ['currentPassword']
  })
