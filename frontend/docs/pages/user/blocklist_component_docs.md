
# Componente `BlockList`

## 📌 Descripción general

El componente `BlockList` permite al usuario ver la lista de usuarios que ha bloqueado, filtrarlos por nombre y desbloquearlos.

---

## 🧹 Importaciones

```js
import { useEffect, useState } from "react"
import { useOutletContext, Link } from "react-router-dom"
import { blockList, unBlock } from "../../services/user"
import './List.css'
```
- `useEffect` y `useState`: Para manejar ciclo de vida y estados locales.
- `useOutletContext`: Para obtener funciones como `setNotification`.
- `blockList`, `unBlock`: Servicios para obtener la lista de bloqueados y desbloquear usuarios.
- `Link`: Para navegar a los perfiles de usuario.
- `List.css`: Estilos del componente.

---

## 🧠 Estados y funciones

```js
const [blockUsers, setBlockUsers] = useState(null)
const [filter, setFilter] = useState(null)
const [loading, setLoading] = useState(true)
const { setNotification } = useOutletContext()
```
- `blockUsers`: Lista de usuarios bloqueados.
- `filter`: Lista filtrada según búsqueda.
- `loading`: Controla la carga inicial.
- `setNotification`: Muestra notificaciones de error o éxito.

---

## 🔄 Lógica del Componente

### `useEffect: loadBlockList`
```js
useEffect(() => { ... }, [])
```
- Obtiene la lista de usuarios bloqueados usando `blockList`.
- Filtra solo los usuarios activos (`estado === true`).
- Maneja errores con `setNotification`.
- Cambia `loading` a `false` al finalizar.

### `handleUnblock`
```js
const handleUnblock = async (id) => { ... }
```
- Llama a `unBlock` para desbloquear un usuario.
- Actualiza la lista local eliminando el usuario desbloqueado.
- Maneja errores con `setNotification`.

### `handleFilter`
```js
const handleFilter = (e) => { ... }
```
- Filtra `blockUsers` según el nombre ingresado por el usuario.
- Actualiza `filter` para mostrar la lista filtrada.

---

## 🧱 Renderizado

- Muestra `Cargando...` si el estado `loading` es `true`.
- Renderiza input para filtrar usuarios bloqueados.
- Muestra lista de usuarios bloqueados o mensaje si no hay.
- Cada usuario muestra su imagen, nombre con enlace al perfil y botón `Desbloquear`.

```js
let filterList = filter ? filter : blockUsers
return (
    <div className="list-container">
        <h1>Lista de Bloqueados</h1>
        {blockUsers && blockUsers.length === 0 ? (
            <h2>No tienes bloqueados</h2>
        ) : (
            <>
                <input type="text" placeholder="Ingrese un usuario..." onChange={handleFilter} className="filter-input" />
                <ul className="user-list">
                    {filterList && filterList.map(b => (
                        <li key={b.id || b.userName}>
                            <div className="user-info">
                                <img src={`http://localhost:3000/uploads/${b.picture}`} alt="profile" />
                                <Link to={`/user/perfil/${b.userName}`} className="user-name">{b.userName}</Link>
                            </div>
                            <button onClick={() => handleUnblock(b.id)}>Desbloquear</button>
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
export default BlockList
```
- Exporta el componente para ser usado en las rutas de usuarios autenticados.

---

