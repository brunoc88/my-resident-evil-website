export function parseError(error) {
  // fallbackError: en caso de que falle completamente la respuesta del backend
  const fallbackError = error?.error || error?.message || 'Error desconocido'

  // Normalizamos para que siempre sea un array (para que <Notificaciones /> lo maneje igual)
  const errores = Array.isArray(fallbackError) ? fallbackError : [fallbackError]

  return errores
}