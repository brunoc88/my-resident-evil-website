# Componente `ProtectedRoutes`

Este componente sirve para proteger rutas en la aplicación, permitiendo el acceso solo a usuarios autenticados.

---

## Importaciones

```javascript
import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
```

- `Navigate`: Para redireccionar a otra ruta si no está autenticado.
- `Outlet`: Renderiza las rutas hijas protegidas.
- `useOutletContext`: Permite pasar contexto adicional a los componentes hijos.
- `useAuth`: Hook personalizado para acceder al contexto de autenticación.

---

## Lógica del componente

```javascript
const ProtectedRoutes = () => {
  const { isAuth, checkingAuth } = useAuth()
  const context = useOutletContext()

  if (checkingAuth) return <div>Cargando...</div>
  return isAuth ? <Outlet context={context}/> : <Navigate to="/login" />
}
```

- `isAuth`: Booleano que indica si el usuario está autenticado.
- `checkingAuth`: Booleano que indica si la autenticación aún se está verificando.
- Si `checkingAuth` es `true`, muestra un mensaje de carga o spinner.
- Si `isAuth` es `true`, renderiza las rutas hijas mediante `Outlet`.
- Si `isAuth` es `false`, redirige al usuario a la página de login.

---

## Export

```javascript
export default ProtectedRoutes
```

- Exporta el componente para ser usado como wrapper en rutas protegidas.

---

### Notas

- Permite que solo usuarios autenticados accedan a ciertas rutas.
- Puede integrarse con un contexto global o `useOutletContext` para pasar datos a las rutas hijas.
- Ideal para proteger páginas sensibles o contenido privado.

