# 📄 Vista: `Login`

## 📌 Descripción general

El componente `Login` permite a los usuarios autenticarse en la aplicación, ya sea como administrador o como usuario común. Si el usuario ya está autenticado (`isAuth` es `true`), se le muestra un mensaje de bienvenida. En caso contrario, se renderiza un formulario de inicio de sesión con validaciones.

---

## 🧹 Importaciones

```js
import { useState } from "react"
import { validarPassword } from "../utils/validarLogin"
import { useNavigate } from "react-router-dom"
import login from "../services/login"
import { useAuth } from "../context/AuthContext"
import { applyToken } from "../services/token"
import styles from "./Login.module.css"
```

- `useState`: Manejo del estado local.
- `validarPassword`: Función auxiliar para validar el formato del password.
- `useNavigate`: Permite la navegación programática a otras rutas.
- `login`: Función que realiza la petición de autenticación al backend.
- `useAuth`: Funcion de la que vamos a extrar props como isAuth, user, setUser, setToken
- `applyToken`: Funcion de la carpeta servicios donde vamos a setear el token 
- `Login.module.css`: Estilos asociados al componente.

---

## ⚙️ Props

El componente extrae las siguientes props desde `useAuth`:

- `setToken`: Función para guardar el token de sesión.
- `setUser`: Función para guardar los datos del usuario autenticado.
- `isAuth`: Booleano que indica si el usuario ya está autenticado.
- `user`: Objeto con la información del usuario autenticado.

---

## 🧠 Estados locales

```js
const [usuario, setUsuario] = useState({ user: '', password: '' })
const [validationError, setValidationError] = useState('')
const [dbErrorMsj, setDbErrorMsj] = useState('')
```

- `usuario`: Objeto con los campos del formulario (`user` y `password`).
- `validationError`: Guarda errores de validación del formulario (especialmente el password).
- `dbErrorMsj`: Guarda errores provenientes del backend (credenciales incorrectas, usuario inexistente, etc.).

---

## 🧠 Estados & funciones importados
```js
const { setToken, setUser, isAuth, user } = useAuth()
const navigate = useNavigate()
```
- `setToken`: Para establecer el token una vez logrado el login exitoso.
- `setUser`: Para establecer la información del usuario.
- `isAuth`: Indica si el usuario está autenticado o no.
- `user`: Información del usuario.
- `useNavigate`: Función que permite navegar a otra ruta del sitio.

---



## 🔄 Lógica del componente

### `handleChange`

```js
const handleChange = (e) => {
    setValidationError(null)
    const { name, value } = e.target
    setUsuario(prev => ({ ...prev, [name]: value }))
    if (name === 'password') {
        const validation = validarPassword(value)
        setValidationError(validation.password)
    }
}
```

- Actualiza los campos del formulario en tiempo real.
- Si el campo modificado es `password`, ejecuta validaciones y muestra el mensaje correspondiente si hay errores.

### `handleSubmit`

```js
const handleSubmit = async (e) => {
    e.preventDefault()
    if (validationError) {
        setValidationError('Ingresar un password válido!')
    } else {
        setDbErrorMsj(null)
        const { user, password } = usuario
        try {
            const res = await login({ user, password })
            setToken(res.token)
            setUser(res.user)
            localStorage.setItem('loggerReAppUser', JSON.stringify({ token: res.token, user: res.user }))
        } catch (error) {
            setDbErrorMsj(error.message)
        }
    }
}
```

- Si hay errores de validación, muestra un mensaje y evita la solicitud.
- Si no hay errores, realiza la petición al backend y guarda la sesión en el estado y en `localStorage`.

### `handleNavigate`

```js
const handleNavigate = () => {
    navigate('/registrarse')
}
```

- Redirige al formulario de registro mediante React Router.

---

## 🧱 Renderizado condicional

### Si el usuario **NO** está autenticado (`!isAuth`):

- Se muestra el formulario de inicio de sesión.
- Estructura:
  - Input de usuario/email
  - Input de contraseña con validación en tiempo real
  - Botón para iniciar sesión
  - Botón para registrarse
  - Enlace de recuperación de contraseña
  - Imagen lateral (Jill Valentine) con una frase temática

### Si el usuario **YA está autenticado**:

- Se muestra un mensaje de bienvenida personalizado con su nombre de usuario.
- También se le recuerda lo que puede hacer dentro de la aplicación (crear, editar, likear, comentar, mensajearse, etc.).

---

## 📸 Estética

- Usa `Login.module.css` para el diseño visual.
- Divide la vista en dos secciones:
  - Formulario
  - Imagen y texto emocional

---

## ✅ Consideraciones adicionales

- Los errores de validación y del backend se muestran claramente al usuario.
- Se maneja la sesión local mediante `localStorage`.
- Navegación limpia con `useNavigate`.
- Código legible y modularizado (validaciones separadas en `utils`).

