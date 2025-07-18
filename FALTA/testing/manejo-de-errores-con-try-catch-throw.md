
# Manejo de Errores con `try`, `catch` y `throw` en JavaScript (React + Axios)

## 📌 ¿Qué es `try/catch`?
`try/catch` es una estructura de control que permite capturar errores que ocurren durante la ejecución de código asincrónico o propenso a fallos.

```js
try {
  // Código que puede fallar
} catch (error) {
  // Código para manejar el error
}
```

## 🚨 ¿Qué es `throw`?
La sentencia `throw` permite **lanzar un error manualmente**. Esto detiene la ejecución normal y transfiere el control al bloque `catch` más cercano.

```js
throw new Error('Algo salió mal')
```

## ✅ ¿Por qué usamos `error.message`?
Cuando hacés `throw new Error('Mensaje')`, estás creando un objeto como este:

```js
{
  name: "Error",
  message: "Mensaje",
  stack: "..."
}
```

Por lo tanto, en el `catch`, accedés al mensaje real con:

```js
catch (error) {
  console.log(error.message) // "Mensaje"
}
```

## 🔁 Ejemplo completo con `axios`

### Servicio login.js

```js
import axios from 'axios'
const baseUrl = 'http://localhost:3000/'

const login = async ({ user, password }) => {
  try {
    const res = await axios.post(baseUrl, { user, password })
    return res.data
  } catch (error) {
    const data = error.response?.data
    if (data?.error) throw new Error(data.error)
    if (data?.message) throw new Error(data.message)
    throw new Error('Error desconocido')
  }
}

export default login
```

### Componente React

```js
const handleSubmit = async () => {
  try {
    const res = await login({ user, password })
    setToken(res.token)
    setUser(res.user)
  } catch (error) {
    setDbErrorMsj(error.message) // Captura el mensaje del throw
  }
}
```

## 📦 ¿Qué contiene el error de axios en un `catch`?
Cuando `axios` lanza un error, el objeto se ve más o menos así:

```js
{
  response: {
    status: 404,
    data: { error: 'Usuario no encontrado' }
  },
  message: 'Request failed with status code 404',
  name: 'AxiosError'
}
```

Por eso hacemos:

```js
const data = error.response?.data
throw new Error(data.error) // <-- para simplificar el manejo en React
```

## ✅ Conclusión
- Usamos `throw` para propagar errores de forma clara.
- Capturamos `error.message` porque es donde vive el mensaje que pasamos con `new Error()`.
- Esto mantiene nuestro frontend simple, legible y predecible.
