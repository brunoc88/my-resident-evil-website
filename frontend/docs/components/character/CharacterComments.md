# Componente `CharacterComments`

## 📌 Descripción general

El componente `CharacterComments` gestiona el sistema de comentarios en el perfil de un personaje.  
Permite a los usuarios autenticados **crear, editar, eliminar y denunciar comentarios**, además de mostrar los ya existentes en orden cronológico inverso (más recientes primero).

---

## 🧹 Importaciones

```js
import { useForm } from 'react-hook-form'
import { useOutletContext, Link } from 'react-router-dom'
import { comentValidation } from '../../utils/commentValidations.js'
import { postComment, getComments, deleteCommentById, editCommentById } from '../../services/character.js'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './CharacterComments.module.css'
```

- `useForm`: Manejo del formulario de comentarios y validaciones.
- `useOutletContext`: Permite acceder a `setNotification` para mostrar mensajes.
- `Link`: Navegación a perfiles de usuarios desde los comentarios.
- `comentValidation`: Reglas de validación para el campo de comentario.
- `postComment`: Envía un nuevo comentario al backend.
- `getComments`: Recupera los comentarios de un personaje.
- `deleteCommentById`: Elimina un comentario específico.
- `editCommentById`: Edita un comentario existente.
- `useEffect` y `useState`: Hooks para manejo de estado y ciclo de vida.
- `useAuth`: Proporciona el usuario autenticado y la función `navigate`.
- `CharacterComments.module.css`: Estilos del componente.

---

## 🧠 Estados y funciones

```js
const [allComments, setAllComments] = useState(null)
const [editComment, setEditComment] = useState(false)
const [visibleComments, setVisibleComments] = useState(2)
const { setNotification } = useOutletContext()
const { user, navigate } = useAuth()
```

- `allComments`: Lista de comentarios cargados desde el backend.
- `editComment`: Booleano que indica si el formulario está en modo edición.
- `visibleComments`: Controla cuántos comentarios se muestran inicialmente (paginado simple).
- `setNotification`: Muestra mensajes de éxito o error.
- `user`: Información del usuario autenticado.
- `navigate`: Navegación entre rutas.

Formulario con `react-hook-form`:

```js
const { reset, register, watch, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })
let mensaje = watch('mensaje', '')
```

- `reset`: Reinicia los valores del formulario.
- `register`: Vincula inputs al estado del formulario.
- `watch`: Observa cambios en el campo `mensaje` (para mostrar el contador de caracteres).
- `handleSubmit`: Maneja el envío del formulario.
- `errors`: Maneja mensajes de validación.
- `mensaje`: Valor del campo de comentario.

---

## 🔄 Lógica del componente

### `useEffect`: Carga inicial de comentarios
```js
useEffect(() => {
  const loadComments = async () => {
    try {
      const res = await getComments(id)
      setAllComments(res.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
    } catch (error) {
      setNotification({ error: error.message, exito: '' })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    }
  }
  if (!allComments) loadComments()
}, [allComments, id, setNotification])
```
- Carga los comentarios del personaje y los ordena por fecha descendente.
- Maneja errores mostrando notificaciones.

---

### `onSubmit`: Crear comentario
```js
const onSubmit = async (data) => {
  try {
    const res = await postComment(id, data)
    if (res) {
      setComments(prev => prev + 1)
      reset()
      const updated = await getComments(id)
      setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
      setVisibleComments(2)
    }
  } catch (error) {
    setNotification({ error: error.message, exito: '' })
  }
}
```
- Envía un nuevo comentario.
- Actualiza la lista con el backend.
- Reinicia el formulario y reinicia la vista a los dos primeros comentarios.

---

### `handleDeleteComment`: Eliminar comentario
```js
const handleDeleteComment = async (idComentario) => {
  try {
    if (confirm('Desea eliminar este comentario?')) {
      const res = await deleteCommentById(id, idComentario)
      if (res) {
        setComments(prev => prev - 1)
        const updated = await getComments(id)
        setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
        setVisibleComments(2)
      }
    }
  } catch (error) {
    setNotification({ error: error.message || `Hubo un problema:${error}` })
  }
}
```
- Elimina un comentario (con confirmación previa).
- Actualiza lista y contador de comentarios.

---

### `getMyComment`: Preparar edición
```js
const getMyComment = (comment) => {
  reset({ id: comment._id, mensaje: comment.mensaje })
  setEditComment(true)
}
```
- Carga el contenido del comentario en el formulario.
- Activa el modo edición.

---

### `handleEditComment`: Editar comentario
```js
const handleEditComment = async (data) => {
  try {
    const res = await editCommentById(id, data.id, data)
    if (res) {
      reset({ mensaje: '' })
      const updated = await getComments(id)
      setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
      setEditComment(false)
      setVisibleComments(2)
    }
  } catch (error) {
    setNotification({ error: error.message || `Hubo un problema:${error}` })
  }
}
```
- Envía cambios de un comentario editado.
- Actualiza la lista y limpia el formulario.

---

### `handleMakeComplaintUser`: Denunciar usuario
```js
const handleMakeComplaintUser = (idUsuario, userName) => {
  navigate(`/denuncias/crear/usuario/${userName}/${idUsuario}?fromCharacter=${id}`)
}
```
- Redirige al formulario de denuncias para reportar al autor de un comentario.

---

## 🧱 Renderizado

1. **Formulario de comentario**  
   - Campo `textarea` con validaciones (`comentValidation`).  
   - Botón de envío y contador de caracteres.  
   - Maneja tanto **creación** como **edición** según `editComment`.

2. **Listado de comentarios**
   - Si no hay comentarios: `"¡Sé el primer comentario!"`.
   - Cada comentario muestra:
     - Foto de perfil.
     - Usuario (link al perfil).
     - Fecha.
     - Texto del comentario.
     - Opciones:
       - **Editar** (solo propio).
       - **Eliminar** (propio o admin).
       - **Denunciar** (otros usuarios).
   - Botón **"Ver más"** para cargar 2 comentarios adicionales.

---

## 📦 Exportación

```js
export default CharacterComments
```
- Exporta el componente para su uso dentro de la vista de personajes.
