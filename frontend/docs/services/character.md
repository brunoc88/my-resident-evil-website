# Servicio de Personajes (`personaje.js`)

## 📌 Descripción general

Este archivo contiene funciones para interactuar con el backend relacionadas con los personajes, incluyendo crear, editar, eliminar personajes, gestionar likes y comentarios, así como obtener listas y detalles de personajes.

---

## 🧹 Importaciones

```js
import { getToken } from './token'
import handleAxiosError from '../utils/handleAxiosError'
import api from './api'
```
- `getToken`: Función que obtiene el token de autenticación del usuario.
- `handleAxiosError`: Función auxiliar para manejar errores de Axios.
- `api`: Instancia central de axios.

---


## 🔄 Funciones

### `characterPost`
```js
const characterPost = async (data) => { ... }
```
- Crea un nuevo personaje enviando un POST a `/alta`.
- Requiere token de autenticación.
- `data`: Objeto con la información del personaje.
- Maneja errores con `handleAxiosError`.

### `characterList`
```js
const characterList = async () => { ... }
```
- Obtiene la lista de todos los personajes (ruta pública) con GET a `/all`.
- Maneja errores con `handleAxiosError`.

### `getCharacterById`
```js
const getCharacterById = async (id) => { ... }
```
- Obtiene la información de un personaje por su `id`.
- Ruta pública con GET a `/${id}`.
- Maneja errores con `handleAxiosError`.

### `sendLike`
```js
const sendLike = async (id) => { ... }
```
- Envía un like a un personaje con PATCH a `/${id}/like`.
- Requiere token de autenticación.
- Maneja errores con `handleAxiosError`.

### `sendUnlike`
```js
const sendUnlike = async (id) => { ... }
```
- Remueve un like de un personaje con PATCH a `/${id}/unlike`.
- Requiere token de autenticación.
- Maneja errores con `handleAxiosError`.

### `getComments`
```js
const getComments = async (id) => { ... }
```
- Obtiene todos los comentarios de un personaje con GET a `/${id}/comentarios`.
- Requiere token.
- Maneja errores con `handleAxiosError`.

### `postComment`
```js
const postComment = async (id, data) => { ... }
```
- Publica un comentario en un personaje con POST a `/${id}/comentario`.
- Requiere token.
- `data`: Objeto con el contenido del comentario.
- Maneja errores con `handleAxiosError`.

### `deleteCommentById`
```js
const deleteCommentById = async (id, idComentario) => { ... }
```
- Elimina o marca como resuelto un comentario con PATCH a `/${id}/comentario/${idComentario}`.
- Requiere token.
- Maneja errores con `handleAxiosError`.

### `editCommentById`
```js
const editCommentById = async (id, idComentario, data) => { ... }
```
- Edita un comentario existente con PUT a `/${id}/comentario/${idComentario}`.
- Requiere token.
- `data`: Objeto con los nuevos datos del comentario.
- Maneja errores con `handleAxiosError`.

### `deleteCharacterById`
```js
const deleteCharacterById = async (id) => { ... }
```
- Elimina un personaje con PATCH a `/eliminar/${id}/`.
- Requiere token.
- Maneja errores con `handleAxiosError`.

### `editCharacterById`
```js
const editCharacterById = async (id, data) => { ... }
```
- Edita un personaje existente con PUT a `/editar/${id}/`.
- Requiere token.
- `data`: Objeto con los nuevos datos del personaje.
- Maneja errores con `handleAxiosError`.

---

## 📦 Exportaciones

```js
export {
    characterPost,
    characterList,
    getCharacterById,
    sendLike,
    sendUnlike,
    getComments,
    postComment,
    deleteCommentById,
    editCommentById,
    deleteCharacterById,
    editCharacterById
}
```
- Exporta todas las funciones para ser utilizadas en los componentes de personajes.

