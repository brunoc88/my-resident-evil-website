# 🧰 Utilidad: `handleAxiosError`

Archivo: `utils/handleAxiosError.js`

```js
export const handleAxiosError = (error) => {
  const data = error.response?.data

  if (data?.error) throw new Error(
    Array.isArray(data.error)
      ? data.error.join('\n')
      : data.error
  )

  if (data?.message) throw new Error(data.message)

  throw new Error('Error desconocido')
}

export default handleAxiosError
```

## 📝 Descripción

Esta función estandariza el manejo de errores provenientes de peticiones Axios en el frontend. Recibe un objeto `error` lanzado por Axios y lanza un `Error` con un mensaje más claro y legible para el usuario.

## 🧠 Comportamiento

1. Intenta acceder a `error.response.data`.
2. Si existe un campo `error` en `data`, lo lanza como excepción:
   - Si es un array, los une con saltos de línea (`\n`).
   - Si es un string, lo lanza directamente.
3. Si no existe `error`, pero sí un campo `message`, lanza ese mensaje.
4. Si no hay información útil en la respuesta, lanza un error genérico: `"Error desconocido"`.

## ✅ Ventajas

- Centraliza el manejo de errores.
- Permite mostrar mensajes de error más precisos y coherentes al usuario.
- Compatible con APIs que devuelven múltiples errores (como arrays de validaciones).
- Mejora la legibilidad y el mantenimiento del código.

## 🧪 Ejemplo de uso

```js
import handleAxiosError from '../utils/handleAxiosError'

try {
  const res = await login({ user, password })
  // manejar respuesta
} catch (error) {
  handleAxiosError(error) // Lanza el mensaje de error apropiado
}
```

---

Ideal para integrar en cualquier servicio basado en Axios dentro del proyecto.
