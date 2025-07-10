export function parseError(error) {
  // Intentamos obtener el array de errores del response (backend)
  const backendErrors = error?.response?.data?.error

  // Si backendErrors es array, lo usamos, sino buscamos message o fallback genérico
  const fallback = Array.isArray(backendErrors)
    ? backendErrors
    : error?.message || 'Error desconocido'

  // Normalizamos a array si es string u otro tipo
  return Array.isArray(fallback) ? fallback : [fallback]
}