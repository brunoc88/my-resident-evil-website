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
import './Login.css'
```

- `useState`: Manejo del estado local.
- `useNavigate`: Permite la navegación programática a otras rutas.
- `validarPassword`: Función auxiliar para validar el formato del password.
- `login`: Función que realiza la petición de autenticación al backend.
- `Login.css`: Estilos asociados al componente.

---

## ⚙️ Props

El componente recibe las siguientes props desde el componente `App.jsx`:

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

## 🛄 Validación de contraseña

Archivo: `utils/validarLogin.js`

```js
const validarPassword = (password) => {
    let error = { password: '', flag: false }

    if (password) {
        if (password.length < 5) {
            error.password = 'Password inválido!'
            error.flag = true
            return error
        }
        if (/\s/.test(password)) {
            error.password = 'El password no debe contener espacios'
            error.flag = true
            return error
        }
    }

    return error
}
```

- Valida que el `password` tenga al menos 5 caracteres y no contenga espacios.
- Devuelve un objeto con el mensaje de error y una bandera (`flag`) que indica si hubo fallo.

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

- Usa `Login.css` para el diseño visual.
- Divide la vista en dos secciones:
  - Formulario
  - Imagen y texto emocional

---

## ✅ Consideraciones adicionales

- Los errores de validación y del backend se muestran claramente al usuario.
- Se maneja la sesión local mediante `localStorage`.
- Navegación limpia con `useNavigate`.
- Código legible y modularizado (validaciones separadas en `utils`).

