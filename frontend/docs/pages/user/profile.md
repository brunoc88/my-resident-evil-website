# Componente `Profile`

El componente `Profile` es un componente de React que maneja la visualización de un perfil de usuario dentro de la aplicación. Permite mostrar información del usuario, seguir/desseguir usuarios, bloquear/desbloquear usuarios y eliminar cuentas. También se adapta al perfil propio o al de otro usuario.

---

## Importaciones

```javascript
import { useEffect, useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useOutletContext, useParams, Link } from "react-router-dom"
import { myProfile, userProfile, follow, unFollow, deleteAccount, block, unBlock } from '../../services/user.js'
import styles from './Profile.module.css'
```

- `useEffect`, `useState`: Hooks de React para manejar efectos secundarios y estados locales.
- `useAuth`: Contexto de autenticación que provee información del usuario, navegación y manejo de logout.
- `useOutletContext`: Para obtener funciones y datos del contexto del `Outlet` de React Router.
- `useParams`: Obtiene parámetros de la URL (`userName`).
- `Link`: Componente de React Router para navegación interna.
- Servicios (`myProfile`, `userProfile`, `follow`, `unFollow`, `deleteAccount`, `block`, `unBlock`) para interactuar con el backend.
- `styles`: Estilos CSS modularizados.

---

## Estados Locales

```javascript
const [profile, setProfile] = useState(null)
const [loading, setLoading] = useState(true)
const [seguidores, setSeguidores] = useState(null)
const [seguidos, setSeguidos] = useState(null)
const [loSigo, setLoSigo] = useState(null)
const [isBlock, setIsBlock] = useState(null)
const [imBlock, setImBlock] = useState(null)
```

- `profile`: Información del perfil que se está mostrando.
- `loading`: Estado de carga mientras se obtiene la información.
- `seguidores`, `seguidos`: Cantidad de seguidores y seguidos del usuario.
- `loSigo`: Indica si el usuario logueado sigue a este perfil.
- `isBlock`: Indica si el usuario logueado bloqueó a este perfil.
- `imBlock`: Indica si el perfil mostrado ha bloqueado al usuario logueado.

---

## Contextos

```javascript
const { setNotification } = useOutletContext()
const { user, setUser, navigate, handleLogout } = useAuth()
const { userName } = useParams()
```

- `setNotification`: Función para mostrar mensajes de error o éxito.
- `user`, `setUser`: Información del usuario logueado y función para actualizarlo.
- `navigate`: Función para navegación programática.
- `handleLogout`: Función para cerrar sesión.
- `userName`: Nombre de usuario pasado en la URL.

---

## `useEffect` Principal

Se ejecuta cuando cambia `userName`. Carga el perfil:

```javascript
useEffect(() => {
  setProfile('')
  const loadProfile = async () => {
    try {
      if (!userName) {
        // Perfil propio
        const res = await myProfile()
        setProfile(res.user)
        setSeguidos(res.user.seguidos.length)
        setSeguidores(res.user.seguidores.length)
      } else {
        // Perfil de otro usuario
        const res = await userProfile(userName)
        setProfile(res.user)
        setSeguidos(res.user.seguidos.length)
        setSeguidores(res.user.seguidores.length)

        setIsBlock(user.bloqueos.includes(res.user.id))
        setImBlock(res.user.bloqueos.includes(user.id))
        setLoSigo(user.seguidos.includes(res.user.id))
      }
    } catch (error) {
      setNotification({ error: error.message || `Hubo un problema: ${error}` })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }
  loadProfile()
}, [userName])
```

- Si `userName` no existe, se carga el perfil propio.
- Si `userName` existe, se carga otro perfil y se calculan los estados de seguimiento y bloqueos.

---

## Funciones Principales

### `handleGoToEditProfile`

Navega a la edición del perfil propio.

```javascript
const handleGoToEditProfile = () => {
  navigate('user/editar')
}
```

---

### `handleFollow`

Permite seguir o dejar de seguir a otro usuario.

```javascript
const handleFollow = async (id) => {
  try {
    if (!loSigo) {
      const res = await follow(id)
      setSeguidores(prev => prev + 1)
      setLoSigo(true)
      setUser({ ...user, seguidos: [...user.seguidos, id] })
    } else {
      const res = await unFollow(id)
      setSeguidores(prev => prev - 1)
      setLoSigo(false)
      setUser({ ...user, seguidos: user.seguidos.filter(uid => uid !== id) })
    }
  } catch (error) {
    setNotification({ error: error.message || `hubo un problema: ${error}` })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```

---

### `handleDeleteAccount`

Permite eliminar la cuenta propia o, si el usuario es admin, otra cuenta.

```javascript
const handleDeleteAccount = async () => {
  try {
    if (confirm('Realmente desea eliminar la cuenta?')) {
      const res = userName && user.rol === 'admin'
        ? await deleteAccount(profile.id)
        : await deleteAccount(user.id)

      if (!userName) handleLogout()
      else navigate('/personajes/index')
    }
  } catch (error) {
    setNotification({ error: error.message || `hubo un problema: ${error}` })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```

---

### `handleBlockUser`

Bloquea o desbloquea a otro usuario según el estado actual.

```javascript
const handleBlockUser = async () => {
  try {
    if (isBlock) {
      if (confirm(`Deseas desbloquar a ${profile.userName}?`)) {
        const res = await unBlock(profile.id)
        setNotification({ error: '', exito: res.msj })
        setIsBlock(false)
        setUser({ ...user, bloqueos: user.bloqueos.filter(uid => uid !== profile.id) })
      }
    } else {
      if (confirm(`Desear bloquear a ${profile.userName}?`)) {
        const res = await block(profile.id)
        setNotification({ error: '', exito: res.msj })
        setIsBlock(true)
        setUser({ ...user, bloqueos: [...user.bloqueos, profile.id] })
      }
    }
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  } catch (error) {
    setNotification({ error: error.message || `hubo un problema: ${error}` })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```

---

## Renderizado Condicional

- Muestra **loading** mientras se cargan datos.
- Muestra un mensaje si el perfil no existe.
- Renderiza el perfil con:
  - Foto de perfil
  - Estadísticas (seguidores y seguidos)
  - Datos del usuario (usuario, email, rol, sobre mí, fecha de creación)
  - Botones de acción según si es perfil propio, de otro usuario o admin.

---

## Export

```javascript
export default Profile
```

---

### Notas

- El componente gestiona tanto el perfil propio como perfiles de otros usuarios.
- Maneja la persistencia de cambios en el estado global `user`.
- Controla interacciones sociales: seguir, bloquear y reportar usuarios.
- Controla la eliminación de cuentas y navegación posterior según permisos.

