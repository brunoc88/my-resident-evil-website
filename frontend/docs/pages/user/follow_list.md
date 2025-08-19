# Componente `FollowList`

El componente `FollowList` es un componente de React que permite mostrar las listas de usuarios que el usuario logueado sigue (`Seguidos`) y los usuarios que lo siguen (`Seguidores`). Además permite seguir o dejar de seguir usuarios directamente desde la lista y filtrar por nombre.

---

## Importaciones

```javascript
import { useEffect, useState } from "react"
import { follow, myFollowed, myFollowers, unFollow } from "../../services/user"
import { useOutletContext, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './List.css'
```

- `useEffect`, `useState`: Hooks de React para manejar efectos secundarios y estados locales.
- Servicios `follow`, `unFollow`, `myFollowed`, `myFollowers` para interactuar con el backend.
- `useOutletContext`: Para mostrar notificaciones desde el contexto del `Outlet`.
- `Link`: Para navegar al perfil del usuario.
- `useAuth`: Contexto de autenticación que provee información del usuario logueado y función para actualizarlo.
- `List.css`: Estilos del componente.

---

## Estados Locales

```javascript
const [seguidos, setSeguidos] = useState([])
const [seguidores, setSeguidores] = useState([])
const [verFollowed, setVerFollowed] = useState(true)
const [filterValue, setFilterValue] = useState("")
```

- `seguidos`: Lista de usuarios que el usuario logueado sigue.
- `seguidores`: Lista de usuarios que siguen al usuario logueado.
- `verFollowed`: Booleano que determina qué lista mostrar (`true` para seguidos, `false` para seguidores).
- `filterValue`: Valor del filtro de búsqueda por nombre de usuario.

Se define además `yo` como una referencia al usuario logueado (`user`) para simplificar comparaciones.

---

## Contextos

```javascript
const { setNotification } = useOutletContext()
const { user, setUser } = useAuth()
```

- `setNotification`: Función para mostrar mensajes de error o éxito.
- `user`, `setUser`: Información del usuario logueado y función para actualizarlo.

---

## Efectos (`useEffect`)

### Cargar seguidos

```javascript
useEffect(() => {
  if (verFollowed && seguidos.length === 0) {
    const loadFollowed = async () => {
      try {
        const res = await myFollowed()
        setSeguidos(res.seguidos)
      } catch (error) {
        setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
        setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
      }
    }
    loadFollowed()
  }
}, [verFollowed])
```

Se ejecuta al cambiar la pestaña a `Seguidos` y solo si la lista aún no está cargada.

### Cargar seguidores

```javascript
useEffect(() => {
  if (!verFollowed && seguidores.length === 0) {
    const loadFollowers = async () => {
      try {
        const res = await myFollowers()
        setSeguidores(res.seguidores)
      } catch (error) {
        setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
        setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
      }
    }
    loadFollowers()
  }
}, [verFollowed])
```

Se ejecuta al cambiar la pestaña a `Seguidores` y solo si la lista aún no está cargada.

---

## Función `handleAction`

Permite seguir o dejar de seguir a un usuario y actualizar tanto el estado local como el contexto global.

```javascript
const handleAction = async (id) => {
  try {
    let res = ''
    if (yo.seguidos.includes(id)) {
      res = await unFollow(id)
      setUser({ ...user, seguidos: user.seguidos.filter(uid => uid !== id) })
    } else {
      res = await follow(id)
      setUser({ ...user, seguidos: [...user.seguidos, id] })
    }

    if (res) {
      const nuevosSeguidos = await myFollowed()
      setSeguidos(nuevosSeguidos.seguidos)
    }

    if (res && res.msj) {
      setNotification({ error: '', exito: res.msj })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    }
  } catch (error) {
    setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```

---

## Función `handleFilter`

```javascript
const handleFilter = (e) => {
  setFilterValue(e.target.value.toLowerCase())
}
```

Actualiza el estado del filtro de búsqueda y permite filtrar los usuarios por nombre.

---

## Filtrado de la lista

```javascript
const filteredList = (verFollowed ? seguidos : seguidores).filter(user =>
  user.userName.toLowerCase().includes(filterValue)
)
```

Filtra la lista actual (`Seguidos` o `Seguidores`) según el valor de búsqueda.

---

## Renderizado

- Input de búsqueda.
- Pestañas `Seguidos` y `Seguidores`.
- Lista de usuarios filtrada.
- Botones de acción para seguir/dejar de seguir.

```javascript
return (
  <div className="list-container">
    <input type="text" placeholder="Ingrese el nombre de usuario" onChange={handleFilter} value={filterValue} className="filter-input" />

    <div className="tabs">
      <button className={verFollowed ? "tab active" : "tab"} onClick={() => { setVerFollowed(true); setFilterValue("") }}>Seguidos</button>
      <button className={!verFollowed ? "tab active" : "tab"} onClick={() => { setVerFollowed(false); setFilterValue("") }}>Seguidores</button>
    </div>

    {filteredList.length === 0 ? (
      <h2>{verFollowed ? "No sigues a nadie." : "No tienes seguidores."}</h2>
    ) : (
      <ul className="user-list">
        {filteredList.map(user => (
          <li key={user.id}>
            <div className="user-info">
              <img src={`http://localhost:3000/uploads/${user.picture}`} alt="profile" />
              <Link to={`/user/perfil/${user.userName}`} className="user-name">{user.userName}</Link>
            </div>
            {yo.seguidos.includes(user.id) ?
              <button onClick={() => handleAction(user.id)}>Dejar de seguir</button>
              : <button onClick={() => handleAction(user.id)}>Seguir</button>
            }
          </li>
        ))}
      </ul>
    )}
  </div>
)
```

---

## Export

```javascript
export default FollowList
```

---

### Notas

- Gestiona tanto la lista de usuarios seguidos como la de seguidores.
- Permite buscar usuarios en la lista filtrando por nombre.
- Mantiene el estado sincronizado entre el componente y el contexto global (`user`).
- Actualiza dinámicamente las listas al seguir o dejar de seguir usuarios.

