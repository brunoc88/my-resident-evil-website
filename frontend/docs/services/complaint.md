
# Servicio de Denuncias (`complaints.js`)

## 📌 Descripción general

Este archivo contiene funciones para interactuar con el backend relacionadas con las denuncias, incluyendo crear una denuncia, obtener todas las denuncias y eliminar/resolver una denuncia.

---

## 🧹 Importaciones

```js
import { getToken } from "./token"
import handleAxiosError from '../utils/handleAxiosError'
import api from './api'
```
- `getToken`: Función que obtiene el token de autenticación del usuario.
- `handleAxiosError`: Función auxiliar para manejar errores de Axios.
- `api`: Instancia central de axios.

---


## 🔄 Funciones

### `makeComplaint`
```js
const makeComplaint = async (data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.post(`denuncias`, data, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}
```
- Recibe un objeto `data` con la información de la denuncia.
- Obtiene el token con `getToken` y lo agrega en los headers.
- Realiza un POST al backend para crear la denuncia.
- Maneja errores con `handleAxiosError`.

### `getComplaits`
```js
const getComplaits = async () => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.get(`denuncias/`, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}
```
- Obtiene el token y lo agrega en los headers.
- Realiza un GET al backend para obtener todas las denuncias.
- Retorna los datos recibidos.
- Maneja errores con `handleAxiosError`.

### `deleteComplaint`
```js
const deleteComplaint = async (id) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.patch(`denuncias/${id}/resolver`, {}, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}
```
- Obtiene el token y lo agrega en los headers.
- Realiza un PATCH al endpoint `/${id}/resolver` para marcar la denuncia como resuelta/eliminarla.
- Maneja errores con `handleAxiosError`.

---

## 📦 Exportaciones

```js
export {
    makeComplaint,
    getComplaits,
    deleteComplaint
}
```
- Exporta las funciones para ser utilizadas en los componentes que gestionen denuncias.

---

