import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Formatear hora (ej: "14:30")
export function formatTime(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "HH:mm", { locale: es })
}

// Formatear fecha (ej: "10 Jun 2023")
export function formatDate(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "d MMM yyyy", { locale: es })
}

// Formatear fecha larga (ej: "10 de junio de 2023")
export function formatDateLong(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es })
}

// Formatear fecha y hora completa (ej: "10 Jun 2023, 14:30")
export function formatDateTime(dateString) {
  if (!dateString) return "N/D"
  return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: es })
}

// Formatear tiempo para inputs datetime-local (ej: "2023-06-10T14:30")
export function formatTimeForInput(dateString) {
  if (!dateString) return ""
  return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm", { locale: es })
}
