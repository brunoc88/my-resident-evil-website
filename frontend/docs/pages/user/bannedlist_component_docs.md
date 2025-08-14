
# Componente `BannedList`

## 📌 Descripción general

El componente `BannedList` permite a los administradores ver la lista de usuarios baneados, filtrar por nombre de usuario y reactivar cuentas. Solo usuarios con rol `admin` pueden acceder.

---

## 🧹 Importaciones

```js
import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { bannedList, reactivateAccount } from "../../services/user"
import { useAuth } from "../../context/AuthContext"
import './List.css'
```
- `useEffect` y `useState`: Para manejar el ciclo de vida y los estados locales.
- `useOutletContext`: Para obtener funciones como `setNotification`.
- `bannedList`, `reactivateAccount`: Servicios para obtener la lista de baneados y reactivar cuentas.
- `useAuth`: Contexto de autenticación para acceder a `user` y `navigate`.
- `List.css`: Estilos del componente.

---

## 🧠 Estados y funciones

```js
const [bannedUsers, setBannedUsers] = useState(null)
const [filter, setFilter] = useState(null)
const [loading, setLoading] = useState(true)
const { setNotification } = useOutletContext()
const { user, navigate } = useAuth()
```
- `bannedUsers`: Lista de usuarios baneados.
- `filter`: Lista filtrada según búsqueda por nombre.
- `loading`: Controla la carga inicial.
- `setNotification`: Muestra notificaciones de error o éxito.
- `user`: Información del usuario autenticado.
- `navigate`: Para redireccionar según permisos.

---

## 🔄 Lógica del Componente

### `useEffect: loadBannedList`
```js
useEffect(() => {
    if (!bannedUsers) loadBannedList()
}, [])
```
- Obtiene la lista de usuarios baneados desde el backend usando `bannedList`.
- Maneja errores con `setNotification`.
- Cambia `loading` a `false` al finalizar.

### `handleFilter`
```js
const handleFilter = (e) => {
    let value = e.target.value
    if (!value) setFilter('')
    const usersFilter = bannedUsers.filter(user => user.userName.includes(value.trim().toLowerCase()))
    setFilter(usersFilter)
}
```
- Filtra la lista de usuarios baneados por nombre según el input del usuario.

### `handleReActivarCuenta`
```js
const handleReActivarCuenta = async (id) => { ... }
```
- Llama a `reactivateAccount` para reactivar la cuenta.
- Muestra notificación de éxito o error.
- Actualiza la lista de baneados eliminando el usuario reactivado.

---

## 🧱 Renderizado

- Si el usuario no es admin, redirige a `/login`.
- Si está cargando, muestra `Cargando...`.
- Renderiza input para filtrar usuarios.
- Muestra la lista de usuarios baneados o mensaje si no hay.
- Cada usuario muestra su foto, nombre y un botón `Activar`.

```js
let filterList = filter ? filter : bannedUsers

return (
    <div className="list-container">
        <h1>Lista de Baneados</h1>
        {bannedUsers && bannedUsers.length === 0 ? (
            <h2>No hay cuentas baneadas</h2>
        ) : (
            <>
                <input type="text" placeholder="Ingrese un usuario..." onChange={handleFilter} className="filter-input" />
                <ul className="user-list">
                    {filterList && filterList.map(b => (
                        <li key={b.id || b.userName}>
                            <div className="user-info">
                                <img src={`http://localhost:3000/uploads/${b.picture}`} alt="profile" />
                                <span className="user-name">{b.userName}</span>
                            </div>
                            <button onClick={() => { handleReActivarCuenta(b.id) }}>Activar</button>
                        </li>
                    ))}
                </ul>
            </>
        )}
    </div>
)
```

---

## 📦 Exportación

```js
export default BannedList
```
- Exporta el componente para ser usado en rutas protegidas de administradores.

---

