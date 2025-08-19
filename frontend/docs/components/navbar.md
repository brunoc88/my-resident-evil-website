# Componente `NavBar`

El componente `NavBar` se encarga de renderizar la barra de navegación principal de la aplicación, mostrando enlaces dinámicos según el estado de autenticación del usuario.

---

## Importaciones

```javascript
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import './NavBar.css'
```

- `NavLink`: Para generar enlaces de navegación que puedan destacar la ruta activa.
- `useAuth`: Hook para acceder al contexto de autenticación y obtener información del usuario.
- `NavBar.css`: Estilos para la barra de navegación.

---

## Lógica del componente

```javascript
const NavBar = () => {
    const { isAuth, user, handleLogout } = useAuth()
    return (
        <nav>
            <ul>
                ...
            </ul>
        </nav>
    )
}
```

- `isAuth`: Indica si el usuario está autenticado.
- `user`: Objeto con información del usuario autenticado.
- `handleLogout`: Función para cerrar sesión.

### Secciones del NavBar

1. **Logo y nombre de la aplicación**
    - Siempre visible.
    - Contiene un `NavLink` con el logo.

2. **Enlaces principales**
    - `Personajes`: Tiene un dropdown con enlace a registrar personaje si el usuario está autenticado.
    - `Nosotros` y `Contactanos`: Siempre visibles.

3. **Autenticación**
    - Si `isAuth` es `false`:
        - `Login`
        - `Registrarse`
    - Si `isAuth` es `true`:
        - Dropdown con el nombre de usuario y enlaces a:
            - Lista de bloqueados
            - Lista de baneados (solo admin)
            - Lista de denuncias (solo admin)
            - Buscar usuario
            - Mensajes
        - Botón de `Logout`

---

## Export

```javascript
export default NavBar
```

- Exporta el componente para ser usado en la aplicación principal.

---

### Notas

- Es un componente dinámico que adapta los enlaces mostrados según la autenticación y el rol del usuario.
- La estructura del dropdown depende de CSS para mostrar/ocultar los elementos.
- Los enlaces usan `NavLink` para mantener la ruta activa destacada.

