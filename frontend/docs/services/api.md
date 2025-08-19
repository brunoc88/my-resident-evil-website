# 📄 Archivo: `api.js`

## 📌 Descripción general

Este archivo configura una instancia central de **Axios** para manejar las solicitudes HTTP a el backend y define un **interceptor de respuesta** para capturar errores de autenticación (`401 Unauthorized`).

Permite definir un callback de logout que se ejecuta automáticamente cuando el backend indica que el token del usuario no es válido o ha expirado.

---

## 🧹 Importaciones

```javascript
import axios from 'axios'
```

Se importa **Axios**, la librería HTTP utilizada para hacer peticiones al backend.

---

## ⚙️ Variables y configuración global

```javascript
let logoutCallback = null
```

* `logoutCallback`: Variable que almacenará la función que se ejecutará cuando se reciba un error `401`. Inicialmente es `null`.

---

## 🛠 Función para registrar callback de logout

```javascript
export const setLogoutCallback = (callback) => {
  logoutCallback = callback
};
```

* **Parámetros**:

  * `callback` → función que se ejecutará cuando se detecte un `401`.
* **Uso**:
  Permite al contexto de autenticación (`AuthContext`) o cualquier componente definir la lógica de cierre de sesión automáticamente.

---

## 🌐 Instancia central de Axios

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/',
})
```

* `baseURL`: URL base de la API backend. Todas las solicitudes hechas a través de `api` usarán esta URL como prefijo.

---

## 🔄 Interceptor de respuesta

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (logoutCallback) logoutCallback()
    }
    return Promise.reject(error)
  }
)
```

* **response interceptor**: Permite interceptar todas las respuestas HTTP.
* **Lógica**:

  * Si la respuesta contiene un `status` 401 → se ejecuta el callback de logout registrado.
  * Luego, la promesa del error se rechaza para que pueda ser capturada en la lógica del componente que hizo la petición.

---

## 📤 Exportaciones

```javascript
export default api
```

* Exporta la instancia de Axios `api` para usarla en todos los servicios de la aplicación.

---

### ✅ Uso típico

```javascript
import api, { setLogoutCallback } from './api'
import { useAuth } from '../context/AuthContext'

const { handleLogout } = useAuth()

setLogoutCallback(handleLogout)

api.get('/user/profile')
  .then(res => console.log(res.data))
  .catch(err => console.error(err))
```

* Aquí se registra `handleLogout` para que, si el backend responde con `401`, el usuario sea automáticamente deslogueado y redirigido al login.
