# LayOut.js Documentation

## Descripción
Componente de layout principal de la aplicación que envuelve las rutas y provee la barra de navegación, notificaciones y un contenedor para los contenidos de las rutas hijas.

---

## Importaciones
```javascript
import NavBar from "./NavBar"
import Notification from "./Notification"
import { Outlet } from "react-router-dom"
import { useState } from "react"
```

- **NavBar**: Componente de navegación principal.
- **Notification**: Componente para mostrar mensajes de éxito o error.
- **Outlet**: Componente de `react-router-dom` que renderiza las rutas hijas.
- **useState**: Hook de React para manejar estado local.

---

## Estado
```javascript
const [notification, setNotification] = useState({ error: '', exito: '' })
```
- **notification**: Objeto que contiene mensajes de notificación.
  - `error`: Mensaje de error.
  - `exito`: Mensaje de éxito.
- **setNotification**: Función para actualizar el estado de `notification`.

---

## Renderizado
```javascript
return (
  <>
    <NavBar />
    <main>
      <Notification {...notification} />
      <Outlet context={{ setNotification }} />
    </main>
  </>
)
```

- Renderiza el **NavBar** en la parte superior.
- Renderiza un `<main>` que contiene:
  - **Notification**: muestra errores o mensajes de éxito.
  - **Outlet**: permite renderizar las rutas hijas y pasar `setNotification` como contexto.

---

## Contexto
```javascript
<Outlet context={{ setNotification }} />
```
- Proporciona `setNotification` a los componentes hijos a través del `useOutletContext`.

---

## Exportación
```javascript
export default LayOut
```
- Exporta el componente para su uso en `App.js` u otros lugares de la aplicación.

