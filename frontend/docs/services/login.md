# Funcion de Logueo

## 📌 Descripción general

Función que permite que un usuario se autentique en el sistema.

--- 

## 🧹 Importaciones 

```js
import axios from 'axios'
import handleAxiosError from '../utils/handleAxiosError'
```

- `axios` Librería para realizar llamadas al backend.
- `handleAxiosError` Función auxiliar para manejar los errores que provienen del backend.

---

## Variables

```js
const baseUrl = 'http://localhost:3000/'
```

- `baseUrl` Ruta del servidor backend. Durante desarrollo se utiliza localhost.

---

## 🔄 Lógica

### `login`

```js
const login = async ({ user, password }) => {
  try {
    const res = await axios.post(baseUrl, { user, password })
    return res.data
  } catch (error) {
    // Aquí extraemos el mensaje que vino del backend, sea error o mensaje
    handleAxiosError(error)
  }
}
```
- La función `login` recibe como parametro un objeto con las propiedades `user` y `password`.  - Si las credenciales del usuario son correctas el backend nos devolvera el token y información del usuario.
- Si ocurre un error, se maneja automáticamente mediante `handleAxiosError(error)`.

---

## Exportacion

```js
export default login
```

- Permite que la función sea utilizada por el componente homónimo u otros módulos.
