
# Componente `ComplaintList`

## 📌 Descripción general

El componente `ComplaintList` muestra una lista de todas las denuncias disponibles para administradores, permitiendo ver los detalles o eliminar denuncias.

---

## 🧹 Importaciones

```js
import { useEffect, useState } from "react"
import { getComplaits, deleteComplaint } from "../../services/complaints"
import { useAuth } from "../../context/AuthContext"
import { useOutletContext } from "react-router-dom"
import './ComplaintList.css'
```

- `useEffect` y `useState`: Para manejo de estado local y efectos secundarios.
- `getComplaits`, `deleteComplaint`: Funciones del servicio para obtener y eliminar denuncias.
- `useAuth`: Proporciona `user` y `navigate` para control de autenticación y redirección.
- `useOutletContext`: Accede a funciones del contexto, como `setNotification`.
- `ComplaintList.css`: Estilos asociados al componente.

---

## 🧠 Estados y funciones

```js
const [complaints, setComplaints] = useState([])
const [loading, setLoading] = useState(true)
const { setNotification } = useOutletContext()
const { user, navigate } = useAuth()
const isAdmin = user?.rol === 'admin'
```

- `complaints`: Lista de todas las denuncias.
- `loading`: Estado de carga de los datos.
- `setNotification`: Para mostrar mensajes de éxito o error.
- `user` y `navigate`: Usuario actual y función para redireccionar.
- `isAdmin`: Booleano que indica si el usuario es administrador.

---

## 🔄 Lógica del componente

### `useEffect`: Cargar denuncias y verificar rol

```js
useEffect(() => {
  if (!isAdmin) {
    navigate('/login')
    return
  }
  const loadComplaints = async () => {
    try {
      const res = await getComplaits()
      if (res && res.denuncias) setComplaints(res.denuncias)
    } catch (error) {
      setNotification({ error: error.message || `Hubo un error: ${error}` })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }
  loadComplaints()
}, [isAdmin, navigate, setNotification])
```
- Verifica que el usuario sea administrador y redirige al login si no lo es.
- Obtiene la lista de denuncias y maneja errores y estado de carga.

### `handleView`
```js
const handleView = (id) => {
  navigate(`/denuncias/info/${id}`)
}
```
- Redirige al detalle de la denuncia seleccionada.

### `handleDelete`
```js
const handleDelete = async (id) => {
  let msj = 'Esta seguro que quiere eliminar esta denuncia?'
  if (confirm(msj)) {
    try {
      const res = await deleteComplaint(id)
      if (res) {
        setComplaints(complaints.filter(c => c._id !== id))
      }
    } catch (error) {
      setNotification({ error: error.message || `hubo un error: ${error}`, exito: '' })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    }
  }
}
```
- Confirma con el usuario antes de eliminar la denuncia.
- Llama a `deleteComplaint` y actualiza la lista eliminando el registro correspondiente.
- Maneja errores mostrando notificaciones.

---

## 🧱 Renderizado

- Mientras se cargan los datos:
```js
if (loading) return <p>Cargando...</p>
```

- Lista de denuncias en tabla:
```js
<div className="complaint-list">
  <h1>Listado de denuncias:</h1>
  <table className="tabla-denuncias">
    <thead>
      <tr>
        <th>De:</th>
        <th>Motivo:</th>
        <th>Fecha:</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {complaints.map(c => (
        <tr key={c._id}>
          <td>{c.denunciante.userName}</td>
          <td>{c.motivo}</td>
          <td>{new Date(c.fecha).toLocaleString()}</td>
          <td className="botones-cell">
            <div className="botones">
              <button type="button" onClick={() => handleView(c._id)}>Ver</button>
              <button type="button" className="eliminar" onClick={() => handleDelete(c._id)}>Eliminar</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```
- Muestra el nombre del denunciante, motivo, fecha y botones de acción (ver y eliminar).

---

## 📦 Exportación

```js
export default ComplaintList
```
- Exporta el componente para usarlo en rutas definidas en `App.js`.

---

