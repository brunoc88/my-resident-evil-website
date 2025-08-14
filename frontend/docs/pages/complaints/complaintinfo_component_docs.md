
# Componente `ComplaintInfo`

## 📌 Descripción general

El componente `ComplaintInfo` muestra la información detallada de una denuncia específica y permite a administradores eliminarla o regresar a la lista de denuncias.

---

## 🧹 Importaciones

```js
import { useEffect, useState } from "react"
import { deleteComplaint, getComplaits } from "../../services/complaints"
import { useOutletContext, useParams, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './ComplaintInfo.css'
```

- `useEffect` y `useState`: Para manejar estado local y efectos secundarios.
- `deleteComplaint`, `getComplaits`: Funciones de servicios para eliminar o obtener denuncias.
- `useOutletContext`: Accede a funciones del contexto como `setNotification`.
- `useParams`: Obtiene parámetros de la ruta, como el `id` de la denuncia.
- `useAuth`: Proporciona `user` y `navigate` para control de autenticación y redirección.
- `ComplaintInfo.css`: Estilos asociados al componente.

---

## 🧠 Estados y funciones

```js
const [complaint, setComplaint] = useState(null)
const [loading, setLoading] = useState(true)
const { setNotification } = useOutletContext()
const { user, navigate } = useAuth()
const { id } = useParams()
const isAdmin = user?.rol === 'admin'
```

- `complaint`: Objeto con los datos de la denuncia actual.
- `loading`: Controla el estado de carga de la información.
- `setNotification`: Muestra mensajes de éxito o error.
- `user` y `navigate`: Objeto del usuario actual y función para redirección.
- `id`: Parámetro de la denuncia desde la ruta.
- `isAdmin`: Booleano que indica si el usuario es administrador.

---

## 🔄 Lógica del componente

### `useEffect`: Cargar denuncia y verificar rol

```js
useEffect(() => {
  if (!isAdmin) {
    navigate('/login')
    return
  }

  const loadComplaint = async () => {
    try {
      const res = await getComplaits()
      if (res && res.denuncias) {
        let complaints = res.denuncias
        setComplaint(complaints.find(c => c._id === id))
      }
    } catch (error) {
      setNotification({ error: error.message || `Hubo un error: ${error}` })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  loadComplaint()
}, [isAdmin, id, navigate, setNotification])
```
- Verifica que el usuario sea administrador; si no, redirige al login.
- Obtiene todas las denuncias y filtra la que corresponde al `id` de la ruta.
- Maneja errores y actualiza `loading` al finalizar.

### `handleBackTo`
```js
const handleBackTo = () => {
  navigate('/denuncias/lista')
}
```
- Redirige a la lista de denuncias.

### `handleDelete`
```js
const handleDelete = async (id) => {
  try {
    let msj = 'Esta seguro que quiere eliminar esta denuncia?'
    if (confirm(msj)) {
      const res = await deleteComplaint(id)
      if (res) handleBackTo()
    }
  } catch (error) {
    setNotification({ error: error.message || `Hubo un error: ${error}` })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```
- Pregunta al administrador antes de eliminar la denuncia.
- Llama a `deleteComplaint` para eliminarla y luego vuelve a la lista.
- Maneja errores mostrando notificaciones.

---

## 🧱 Renderizado

- Mientras carga los datos:
```js
if (loading) return <p>Cargando...</p>
```

- Si no se encuentra la denuncia:
```js
if (!complaint) return <p className="error">No se encontró la denuncia.</p>
```

- Mostrar información de la denuncia y acciones:
```js
<div className="complaint-container">
  <h1 className="title">Datos de la Denuncia</h1>
  <div className="complaint-detail"><strong>Denunciante:</strong> <span>{complaint.denunciante.userName}</span></div>
  <div className="complaint-detail"><strong>Entidad:</strong> <span>{complaint.entidad.tipo === 'User' ? 'Usuario' : 'Personaje'}</span></div>
  <div className="complaint-detail"><strong>Motivo:</strong> <span>{complaint.motivo}</span></div>
  <div className="complaint-detail"><strong>Mensaje:</strong> <p className="mensaje">{complaint.mensaje}</p></div>
  <div className="complaint-detail"><strong>Estado:</strong> <span>{complaint.estado ? 'Activo' : 'Inactivo'}</span></div>
  <div className="complaint-detail"><strong>Fecha:</strong> <span>{new Date(complaint.fecha).toLocaleString()}</span></div>
  <div>
    <button onClick={() => handleDelete(complaint._id)}>Eliminar</button>
    <button onClick={handleBackTo}>Volver</button>
  </div>
</div>
```
- Muestra todos los campos importantes de la denuncia.
- Permite eliminar la denuncia o regresar a la lista.

---

## 📦 Exportación

```js
export default ComplaintInfo
```
- Exporta el componente para usarlo en las rutas definidas en `App.js`.

---

