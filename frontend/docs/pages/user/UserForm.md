
# 📄 Componente: UserForm

Componente de React que maneja el registro y edición de usuarios en la aplicación. Puede funcionar para usuarios normales o administradores según la prop `isAdmin`.

---

## 🔹 Importaciones

```js
import { useForm } from 'react-hook-form'
import { userPost, userAdminPost, myProfile, userEdit } from '../../services/user'
import login from '../../services/login'
import { useOutletContext } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { applyToken } from '../../services/token'
```

- `useForm`: Para manejar formularios y validaciones.
- `myProfile`, `userPost`, `userAdminPost`, `userEdit`: Servicios de usuario.
- `login`: Servicio de login.
- `useAuth`: Contexto de autenticación.
- `useOutletContext`: Contexto de rutas anidadas (para notificaciones).
- `applyToken`: Aplica token JWT para servicios.

---

## 🔹 Props

| Prop       | Tipo    | Descripción                                   |
|------------|--------|-----------------------------------------------|
| `isAdmin`  | Boolean | Indica si el formulario es para un admin.    |

---

## 🔹 Estados y Hooks

- `useForm` maneja:
  - `register`: Registro de inputs.
  - `handleSubmit`: Manejo de envío del form.
  - `watch`: Para observar cambios en campos específicos (`userName`, `sobreMi`, `respuesta`).
  - `reset`: Resetea los valores del formulario.
  - `errors`: Errores de validación.

- `useAuth`:
  - `setToken`, `setUser`: Guardar token y usuario en contexto.
  - `isAuth`: Estado de autenticación.
  - `navigate`: Navegación de rutas.

- `useOutletContext`:
  - `setNotification`: Muestra mensajes de error o éxito.

---

## 🔹 Funciones internas

### 1. `useEffect` – cargarPerfil
Si el usuario está autenticado (`isAuth`), carga su perfil desde `myProfile` y resetea el formulario con los datos.

### 2. `onSubmit(data)`
Se ejecuta al enviar el formulario para **registro** (nuevo usuario).

- Convierte los datos a `FormData`.
- Si es admin, añade `secreto`.
- Llama a `userPost` o `userAdminPost`.
- Si el registro es exitoso, hace login automáticamente y guarda token + user en contexto y `localStorage`.
- Redirige a `/personajes/index`.

### 3. `handleEditar(data)`
Se ejecuta al enviar el formulario para **editar usuario** autenticado.

- Convierte los datos a `FormData`.
- Llama a `userEdit` con el ID del usuario.
- Muestra notificación de éxito y redirige a `/user/miPerfil`.

### 4. `onVolver(e)`
Evita el envío del formulario y navega a:
- `/user/miPerfil` si está autenticado.
- `/login` si no.

---

## 🔹 Renderizado

- Formulario con campos:
  - `userName`, `password`, `password2`, `email`, `pregunta`, `respuesta`, `sobreMi`, `picture`.
  - `secreto` solo visible si `isAdmin`.
- Contadores de caracteres en `userName`, `sobreMi` y `respuesta`.
- Validaciones importadas desde `userValidation`.
- Botones: `Enviar` y `Volver`.
- Imágenes decorativas a los lados (`/leonForm.jpg`, `/adaForm.jpg`) según autenticación.
- Notificaciones de error o éxito mediante `setNotification`.

---

## 🔹 Estilos

Archivo CSS importado: `UserForm.css`.  

---

## 🔹 Exportación

```js
export default UserForm
```

---

**Notas:**
- Compatible con usuarios normales y administradores.
- Maneja validaciones, errores y notificaciones centralizadas.
- Permite carga y edición de imágenes (`FormData`).
- Redirige automáticamente tras registro o edición.
