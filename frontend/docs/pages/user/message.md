# Componente `Message`

El componente `Message` permite a un usuario enviar y recibir mensajes privados con otro usuario dentro de la aplicación. Gestiona el estado del chat, verifica bloqueos, usuarios inactivos y despliega la conversación en tiempo real.

---

## Importaciones

```javascript
import { useForm } from 'react-hook-form'
import { useParams, useOutletContext, Link } from 'react-router-dom'
import { sendMessage, getUsers, getChats } from '../../services/user'
import { useEffect, useState } from 'react'
import { mensajeValidation } from '../../utils/messageValidations'
import { useAuth } from '../../context/AuthContext'
import './Message.css'
```

- `useForm`: Para manejar el formulario de envío de mensajes.
- `useParams`: Obtiene el id del usuario con el que se va a chatear desde la URL.
- `useOutletContext`: Para notificaciones globales.
- `Link`: Para navegar al perfil del usuario.
- Servicios: `sendMessage`, `getUsers`, `getChats` para interactuar con el backend.
- `mensajeValidation`: Validaciones para el mensaje.
- `useAuth`: Contexto de autenticación.
- `Message.css`: Estilos del chat.

---

## Estados Locales

```javascript
const [userToChat, setUserToChat] = useState(null)
const [loading, setLoading] = useState(true)
const [chatMessages, setChatMessages] = useState([])
const [imBlock, setImBlock] = useState(null)
const [isBlock, setIsBlock] = useState(null)
const [isActive, setIsActive] = useState(null)
```

- `userToChat`: Información del usuario con el que se chatea.
- `loading`: Indica si se están cargando datos.
- `chatMessages`: Lista de mensajes del chat.
- `imBlock`: Indica si el usuario mostrado bloqueó al logueado.
- `isBlock`: Indica si el usuario logueado bloqueó al otro usuario.
- `isActive`: Indica si el usuario destino está activo.

`mensaje` se obtiene mediante `watch` del formulario.

---

## Contextos

```javascript
const { setNotification } = useOutletContext()
const { user, navigate } = useAuth()
```

- `setNotification`: Para mostrar mensajes de error o éxito.
- `user`: Usuario logueado.
- `navigate`: Para redireccionar.

---

## `useEffect`

### Cargar información del usuario a chatear

```javascript
useEffect(() => {
    const loadUser = async () => {
        try {
            const res = await getUsers()
            const userFilter = res.find(user => user.id === id)
            if (userFilter && userFilter.estado === true) {
                setUserToChat(userFilter)
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
        } finally {
            setLoading(false)
        }
    }
    if (loading) loadUser()
}, [])
```

### Cargar mensajes del chat

```javascript
useEffect(() => {
    const loadChats = async () => {
        try {
            const res = await getChats(userToChat.id)
            if (res && res.mensajes) setChatMessages(res.mensajes.filter(m => m.estado))
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
        }
    }
    if (userToChat) loadChats()
}, [userToChat])
```

### Verificar bloqueos

```javascript
useEffect(() => {
    const checkBlockInfo = () => {
        setIsBlock(user.bloqueos.includes(userToChat.id))
        setImBlock(userToChat.bloqueos.includes(user.id))
    }
    if (user && userToChat) checkBlockInfo()
}, [user, userToChat])
```

---

## Funciones

### `onSubmit`

Envía un mensaje al usuario y actualiza la lista de mensajes.

```javascript
const onSubmit = async (data) => {
    try {
        const res = await sendMessage(id, data)
        if (res && res.msj) {
            const update = await getChats(userToChat.id)
            setChatMessages(update.mensajes.filter(m => m.estado))
            reset()
        }
    } catch (error) {
        setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
    }
}
```

### `handleBackToInbox`

Redirige a la bandeja de mensajes.

```javascript
const handleBackToInbox = () => { navigate('/user/mensajes/resumen') }
```

---

## Renderizado

- Muestra imagen y nombre del usuario destino.
- Mensajes del chat diferenciando entre `self` y `other`.
- Bloqueos si existen.
- Formulario de envío de mensaje con validación.
- Botón de envío cambia según si hay mensajes previos.

```javascript
if (loading) return <p>Cargando...</p>
if (!isActive) return (
  <div>
    <h1>Lo sentimos, cuenta eliminada o inactiva!</h1>
    <button onClick={handleBackToInbox}>Volver</button>
  </div>
)
```

Renderizado del chat y formulario:

```javascript
<div className="header-chat">
  <img src={`http://localhost:3000/uploads/${userToChat.picture}`} alt="profile" className="profile-pic" />
  <Link to={`/user/perfil/${userToChat.userName}`}><h2>{userToChat.userName}</h2></Link>

  <div>{isBlock ? 'Bloqueaste a este usuario' : imBlock && 'Has sido bloqueado'}</div>

  <div className="chat-container">
    {chatMessages.map(chat => {
      const isSelf = chat.usuario === userToChat.id
      return (
        <div key={chat._id} className={`chat-message ${isSelf ? 'self' : 'other'}`}>
          <p>{chat.mensaje}</p>
          <div className="chat-meta">
            {new Date(chat.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    })}
  </div>

  <form onSubmit={handleSubmit(onSubmit)}>
    <input type="hidden" {...register("id") } defaultValue={id} />
    {!isBlock && !imBlock && isActive && (
      <>
        <textarea {...register('mensaje', mensajeValidation)}></textarea>
        <div>{mensaje.length}/280</div>
        {errors.mensaje && <span>{errors.mensaje.message}</span>}
        <button type='submit'>{chatMessages.length > 0 ? 'Responder' : 'Enviar'}</button>
      </>
    )}
  </form>
</div>
```

---

## Export

```javascript
export default Message
```

---

### Notas

- Gestiona envío y recepción de mensajes entre dos usuarios.
- Verifica bloqueos mutuos y estado activo del usuario.
- Actualiza mensajes en tiempo real tras enviar.
- Diferencia visual entre mensajes propios y de otro usuario.

