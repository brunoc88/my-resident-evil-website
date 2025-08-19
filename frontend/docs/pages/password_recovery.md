# Componente `PasswordRecovery`

El componente `PasswordRecovery` permite a los usuarios recuperar su contraseña mediante la verificación de correo electrónico y una pregunta de seguridad.

---

## Importaciones

```javascript
import { useForm } from 'react-hook-form'
import { emailValidation, preguntaValidation, respuestaValidation } from '../../utils/userValidation'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { passwordRecovery } from '../../services/user'
import './PasswordRecovery.css'
```

- `useForm` para manejo de formularios y validación.
- Validaciones importadas de `userValidation`.
- `useNavigate`, `useOutletContext` para navegación y notificaciones.
- `passwordRecovery` para la llamada al backend.
- Estilos específicos en `PasswordRecovery.css`.

---

## Estados y Hooks

```javascript
const {
  register,
  handleSubmit,
  watch,
  formState: { errors }
} = useForm({ mode: 'onChange' })

const respuesta = watch('respuesta', '')
const { setNotification } = useOutletContext()
const navigate = useNavigate()
```

- `register` y `watch` para registrar campos y observar cambios.
- `errors` para mostrar mensajes de validación.
- `setNotification` para notificaciones de éxito o error.
- `navigate` para redireccionar a login.

---

## Envío del formulario

```javascript
const onSubmit = async (data) => {
  try {
    const res = await passwordRecovery(data)
    if (res && res.msj) {
      setNotification({
        error: '',
        exito: (
          <>
            Password Provisional: {res.nuevaPassword}
            <br />
            Tiene 15 segundos antes que se borre
          </>
        )
      })
      setTimeout(() => setNotification({ error: '', exito: '' }), 15000)
      navigate('/login')
    }
  } catch (error) {
    setNotification({ error: error.message, exito: '' })
    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
  }
}
```

- Llama al servicio `passwordRecovery`.
- Muestra contraseña provisional con notificación temporal de 15 segundos.
- Redirige a login tras recuperar la contraseña.

---

## Función para volver a login

```javascript
const backToLogin = async () => {
  navigate('/login')
}
```

- Permite al usuario regresar a la pantalla de login sin enviar el formulario.

---

## Renderizado del formulario

```javascript
<form onSubmit={handleSubmit(onSubmit)} className="recovery-form-box">
  <h1>Recupera tu Password!</h1>

  <label htmlFor="email">Email:</label>
  <input type="text" id="email" placeholder="Ej: re@gmail.com" {...register('email', emailValidation)} />
  {errors.email && <span className='error'>{errors.email.message}</span>}

  <label htmlFor="pregunta">Seleccione una pregunta:</label>
  <select id="pregunta" {...register('pregunta', preguntaValidation)}>
    <option value="">-- Elige una opción --</option>
    <option value="RE Favorito?">RE Favorito?</option>
    <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
    <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
  </select>
  {errors.pregunta && <span className='error'>{errors.pregunta.message}</span>}

  <label htmlFor="respuesta">Respuesta:</label>
  <input type="text" id="respuesta" placeholder="Ej: Resident Evil 3 de 1998" {...register('respuesta', respuestaValidation)} />
  <div>{respuesta.length}/60</div>
  {errors.respuesta && <span className='error'>{errors.respuesta.message}</span>}

  <div>
    <button type="submit">Enviar</button>
    <button type="button" onClick={backToLogin}>Volver</button>
  </div>
</form>
<img src="/weskerRecovery.jpg" alt="Izquierda" className="side-image left" />
```

- Campos: email, pregunta de seguridad, respuesta.
- Validación en tiempo real.
- Botones: `Enviar` y `Volver`.
- Imagen lateral decorativa.

---

## Export

```javascript
export default PasswordRecovery
```

- Exporta el componente para ser usado en rutas de la aplicación.

---

### Notas

- Permite recuperación segura mediante pregunta de seguridad.
- Muestra notificación temporal con contraseña provisional.
- Maneja errores de backend y notificaciones de usuario.

