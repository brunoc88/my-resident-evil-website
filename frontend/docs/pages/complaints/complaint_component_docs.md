
# Componente `Complaint`

## 📌 Descripción general

El componente `Complaint` permite a un usuario autenticado realizar una denuncia, ya sea de un personaje, de un comentario o directamente del perfil de un usuario.

---

## 🧹 Importaciones

```js
import { useParams, useSearchParams, useOutletContext } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motivoValidation, mensajeValidation } from "../../utils/complaintValidations"
import { useAuth } from "../../context/AuthContext"
import { makeComplaint } from "../../services/complaints"
import { useEffect, useState } from "react"
import { userProfile } from "../../services/user"
import styles from './Complaint.module.css'
```

- `useParams`: Para obtener parámetros de la ruta.
- `useSearchParams`: Para obtener parámetros de consulta (query params).
- `useOutletContext`: Para acceder a funciones del contexto, como `setNotification`.
- `useForm`: Maneja el formulario y validaciones.
- `motivoValidation` y `mensajeValidation`: Reglas de validación para los campos del formulario.
- `useAuth`: Proporciona la función `navigate` para redireccionar.
- `makeComplaint`: Función que envía la denuncia al backend.
- `useEffect` y `useState`: Hooks para manejo de estado y efectos secundarios.
- `userProfile`: Obtiene información del usuario denunciado.
- `Complaint.module.css`: Estilos asociados al componente.

---

## 🧠 Estados y funciones

```js
const { personaje, userName, id } = useParams()
const { setNotification } = useOutletContext()
const { navigate } = useAuth()
const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' })
const [isActive, setIsActive] = useState(null)
const [loading, setLoading] = useState(true)
const [searchParams] = useSearchParams()
const fromCharacter = searchParams.get("fromCharacter")

let mensaje = watch('mensaje', '')
let motivo = watch('motivo', '')
```

- `personaje, userName, id`: Parámetros de la ruta.
- `setNotification`: Muestra notificaciones de éxito o error.
- `navigate`: Redirige a otras rutas.
- `register, handleSubmit, watch, formState.errors`: Funciones y estados de `useForm`. `watch` permite observar cambios en campos para contadores.
- `isActive`: Indica si la cuenta del usuario denunciado está activa.
- `loading`: Estado de carga de información del usuario.
- `searchParams` y `fromCharacter`: Obtienen parámetros extra de la URL.
- `mensaje` y `motivo`: Controles de longitud de los campos de texto.

---

## 🔄 Lógica del componente

### `useEffect`: Redirección
```js
useEffect(() => {
  if ((userName && id) || (personaje && id)) return
  navigate('/login');
}, [userName, personaje, id, navigate]);
```
- Garantiza que la ruta contenga los parámetros necesarios; si no, redirige al login.

### `useEffect`: Estado del usuario
```js
useEffect(() => {
  const checkUserState = async () => {
    try {
      const res = await userProfile(userName)
      if (res?.user) setIsActive(!!res.user.estado)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  if (userName) checkUserState()
}, [userName])
```
- Verifica si la cuenta del usuario denunciado está activa y controla el estado de carga.

### `onSubmit`
```js
const onSubmit = async (data) => {
  try {
    const res = await makeComplaint(data)
    if (res) {
      setNotification({ error: '', exito: 'Denuncia Realizada' })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
      handleBackTo()
    }
  } catch (error) {
    setNotification({ error: error.message || `Hubo un problema: ${error}` })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```
- Envía la denuncia al backend y muestra notificaciones de éxito o error.

### `handleBackTo`
```js
const handleBackTo = () => {
  if (fromCharacter) navigate(`/personajes/${fromCharacter}`)
  else if (personaje) navigate(`/personajes/${id}`)
  else navigate(`/user/perfil/${userName}`)
}
```
- Redirige según el origen de la denuncia: comentario, personaje o perfil.

---

## 🧱 Renderizado

- Si la cuenta denunciada está eliminada:
```js
if (userName && !isActive && !loading) {
  return (
    <div className={styles.complaintFormLayout}>
      <div className={styles.complaintFormulario}>
        <h1>Cuenta eliminada</h1>
        <p>Lo sentimos, pero la cuenta que intenta denunciar ha sido eliminada.</p>
        <div className="botones">
          <button onClick={handleBackTo}>Volver</button>
        </div>
      </div>
    </div>
  )
}
```

- Mientras carga la información del usuario:
```js
if (userName && loading) return <p>Cargando...</p>
```

- Formulario principal:
```js
<div className={styles.complaintFormLayout}>
  <div className={styles.complaintFormulario}>
    <h1>Realice su denuncia:</h1>
    <p>Complete el formulario para reportar un usuario o personaje.</p>
    <form onSubmit={handleSubmit(onSubmit)} method="post">
      <input type="hidden" {...register("tipo")} defaultValue={userName ? "User" : "Personaje"} />
      <input type="hidden" {...register("id")} defaultValue={id} />

      <div className="campo">
        <label htmlFor="motivo">Motivo:</label>
        <input type="text" id="motivo" placeholder="Ingrese su motivo..." {...register('motivo', motivoValidation)} />
        <div className="contador">{motivo.length}/100</div>
        {errors.motivo && <span>{errors.motivo.message}</span>}
      </div>

      <div className={styles.complaintCampo}>
        <label htmlFor="mensaje">Mensaje:</label>
        <textarea id="mensaje" placeholder="Escriba su denuncia..." {...register('mensaje', mensajeValidation)} />
        <div className="contador">{mensaje.length}/500</div>
        {errors.mensaje && <span>{errors.mensaje.message}</span>}
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit">Enviar</button>
        <button type="button" onClick={handleBackTo}>Volver</button>
      </div>
    </form>
  </div>
</div>
```

- Contiene los campos `motivo` y `mensaje` con validaciones, contador de caracteres y botones de acción.

---

## 📦 Exportación

```js
export default Complaint
```
- Exporta el componente para ser usado en las rutas definidas en `App.js`.

---

