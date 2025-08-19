# Componente `AuthContext` y `AuthProvider`

Este componente proporciona un contexto de autenticación para la aplicación, manejando usuario logueado, token de sesión y funciones relacionadas con el login/logout.

---

## Importaciones

```javascript
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyToken, clearToken } from '../services/token'
import { myProfile } from '../services/user'
import { setLogoutCallback } from '../services/api'
```

- `createContext`, `useContext`: Para crear y consumir contexto.
- `useState`, `useEffect`: Manejo de estado y efectos secundarios.
- `useNavigate`: Para redireccionar en la aplicación.
- Servicios de token y usuario.

---

## Contexto

```javascript
const AuthContext = createContext()
```

- `AuthContext` se usa para almacenar información de usuario, token y funciones de autenticación.

---

## Provider

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const isAuth = !!user
  const navigate = useNavigate()
```

- `user`: Información del usuario logueado.
- `token`: Token JWT del usuario.
- `checkingAuth`: Indica si se está verificando la autenticación.
- `isAuth`: Booleano indicando si el usuario está autenticado.
- `navigate`: Función para navegar a otras rutas.

---

## Efectos

### Verificar usuario logueado en localStorage

```javascript
useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggerReAppUser')
  if (loggedUserJSON) {
    const userData = JSON.parse(loggedUserJSON)
    setToken(userData.token)
    applyToken(userData.token)
  } else {
    setCheckingAuth(false)
  }
}, [])
```

- Recupera información de usuario desde `localStorage`.
- Aplica el token para llamadas al backend.

### Cargar perfil del usuario logueado

```javascript
useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await myProfile()
      setUser(res.user)
    } catch (error) {
      console.log(error)
      handleLogout()
    } finally {
      setCheckingAuth(false)
    }
  }

  if (token) loadUser()
}, [token])
```

- Obtiene datos del usuario logueado desde backend.
- Si falla, realiza logout.

### Configurar callback global de logout

```javascript
useEffect(() => {
  setLogoutCallback(handleLogout);
}, []);
```

- Permite que cualquier servicio que detecte expiración de token pueda llamar a `handleLogout`.

---

## Función de Logout

```javascript
const handleLogout = () => {
  window.localStorage.removeItem('loggerReAppUser')
  clearToken()
  setUser(null)
  setToken(null)
  navigate('/login')
}
```

- Elimina información de `localStorage`.
- Limpia token y estado de usuario.
- Redirige al login.

---

## Provider y valores del contexto

```javascript
return (
  <AuthContext.Provider value={{
    user,
    setUser,
    token,
    setToken,
    isAuth,
    handleLogout,
    checkingAuth,
    navigate
  }}>
    {children}
  </AuthContext.Provider>
)
```

- Expone información y funciones para cualquier componente hijo.

---

## Hook personalizado

```javascript
export const useAuth = () => useContext(AuthContext)
```

- Permite consumir el contexto de autenticación de manera sencilla.

---

### Notas

- Gestiona sesión, token y perfil del usuario.
- Permite logout automático si falla la validación.
- Integrado con `localStorage` para persistencia.
- Funciona como wrapper para toda la aplicación React.

