# Servicio de Token (`token.js`)

## 📌 Descripción general

Este archivo maneja el almacenamiento temporal del token de autenticación del usuario, permitiendo aplicarlo, obtenerlo o eliminarlo según sea necesario.

---

## 🔄 Funciones

### `applyToken`
```js
const applyToken = (newToken) => {
    token = `Bearer ${newToken}`
}
```
- Recibe un `newToken` y lo almacena en la variable interna `token` precedido de `Bearer`.
- Permite que las funciones del servicio lo utilicen en los headers de autenticación.

### `getToken`
```js
const getToken = () => token
```
- Retorna el token almacenado actualmente.
- Si no hay token, retorna `null`.

### `clearToken`
```js
const clearToken = () => {
    token = null
}
```
- Elimina el token almacenado en memoria.
- Se utiliza al cerrar sesión o invalidar la autenticación.

---

## 📦 Exportaciones

```js
export {
    applyToken,
    getToken,
    clearToken
}
```
- Exporta las funciones para ser utilizadas en los servicios que requieren autenticación.

