# Componente `MessageList`

El componente `MessageList` muestra la bandeja de entrada de mensajes del usuario logueado, permitiendo ver mensajes recibidos, responder o eliminar mensajes.

---

## Importaciones

```javascript
import { useState, useEffect } from "react"
import { useOutletContext, Link } from 'react-router-dom'
import { deleteMessage, messageResumen } from "../../services/user"
import styles from './MessageList.module.css'
```

- `useState`, `useEffect`: Para manejar estado y efectos secundarios.
- `useOutletContext`: Para notificaciones globales.
- `Link`: Para redirigir a perfiles de usuarios.
- Servicios: `deleteMessage`, `messageResumen` para interactuar con el backend.
- `MessageList.module.css`: Estilos del componente.

---

## Estados Locales

```javascript
const [loading, setLoading] = useState(true)
const [messages, setMessages] = useState(null)
```

- `loading`: Indica si los mensajes están siendo cargados.
- `messages`: Lista de mensajes de la bandeja de entrada.

---

## Carga de mensajes

```javascript
useEffect(() => {
    const loadInboxMessages = async () => {
        try {
            const res = await messageResumen()
            if (res && res.mensajes) setMessages(res.mensajes)
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        } finally {
            setLoading(false)
        }
    }
    if (loading) loadInboxMessages()
}, [])
```

- Obtiene la lista de mensajes recibidos desde el backend.
- Maneja errores con notificaciones.

---

## Eliminar mensaje

```javascript
const handleDeleteMessage = async (id, userName) => {
    try {
        let msj = `Desea eliminar el mensaje de ${userName}`
        if (confirm(msj)) {
            const res = await deleteMessage(id)
            if (res) {
                setMessages(messages.filter(m => m._id !== id && m.de.userName !== userName))
            }
        }
    } catch (error) {
        setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
    }
}
```

- Pregunta al usuario antes de eliminar.
- Actualiza la lista local tras eliminar.

---

## Renderizado

### Estado de carga

```javascript
if (loading) return <p>Cargando...</p>
```

### Bandeja vacía

```javascript
if (!messages || messages.length === 0) {
    return (
        <div className={styles.inbox}>
            <h1>Bandeja de entrada</h1>
            <p className="list-container">No tiene mensajes!</p>
        </div>
    )
}
```

### Lista de mensajes

```javascript
return (
    <div>
        <h1 className={styles.inbox}>Bandeja de Entrada</h1>
        <div className={styles.commentsContainer}>
            {messages.map(m => (
                <div key={m._id} className={styles.commentCard}>
                    <div className={styles.commentHeader}>
                        <img src={`http://localhost:3000/uploads/${m.de.picture}`} alt="profile" className={styles.profilePic} />
                        <div className={styles.commentMeta}>
                            <Link to={`/user/perfil/${m.de.userName}`}>{m.de.userName}</Link>
                            <span className={styles.date}>{new Date(m.fecha).toLocaleDateString('es-AR')}</span>
                        </div>
                    </div>
                    <p className={styles.commentMessage}>{m.mensaje}</p>
                    <div className={styles.commentOptions}>
                        <Link to={`/user/mensajes/${m.de.id}`} className={styles.actionLink}>Responder</Link>
                        <span onClick={() => handleDeleteMessage(m._id, m.de.userName)} className={styles.actionLink}>Eliminar</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
)
```

- Cada mensaje muestra: imagen de perfil, nombre de usuario, fecha y contenido.
- Botones de acción: `Responder` y `Eliminar`.

---

## Export

```javascript
export default MessageList
```

---

### Notas

- Gestiona la bandeja de entrada del usuario.
- Permite eliminar mensajes con confirmación.
- Actualiza la vista local sin necesidad de recargar la página.
- Muestra mensajes con enlace a perfiles y formato de fecha local.

