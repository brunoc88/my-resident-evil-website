# Archivo Principal `index.js`

Este archivo es el punto de entrada de la aplicación React y se encarga de renderizar la aplicación en el DOM.

---

## Importaciones

```javascript
import App from './App'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './App.css'
```

- `App`: Componente principal de la aplicación.
- `ReactDOM`: Para renderizar la aplicación en el DOM.
- `BrowserRouter`: Proveedor de rutas de React Router.
- `AuthProvider`: Contexto de autenticación para la app.
- `App.css`: Estilos globales de la aplicación.

---

## Renderizado de la aplicación

```javascript
ReactDOM
    .createRoot(document.getElementById('root'))
    .render(
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    )
```

- Se selecciona el elemento con id `root` en el DOM para renderizar la aplicación.
- `BrowserRouter` envuelve la aplicación para habilitar el enrutamiento.
- `AuthProvider` proporciona el contexto de autenticación a toda la aplicación.
- `App` es el componente raíz que contiene toda la estructura de la app.

---

### Notas

- La estructura permite que todos los componentes hijos tengan acceso a las rutas y al contexto de autenticación.
- Este es el archivo que React utiliza para montar la SPA en el navegador.

