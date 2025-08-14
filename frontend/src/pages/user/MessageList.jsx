import { useState, useEffect } from "react"
import { useOutletContext, Link } from 'react-router-dom'
import { deleteMessage, messageResumen } from "../../services/user"
import styles from './MessageList.module.css'

const MessageList = () => {
    const { setNotification } = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(null)

    useEffect(() => {
        const loadInboxMessages = async () => {
            try {
                const res = await messageResumen()
                if (res && res.mensajes) {
                    setMessages(res.mensajes)
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }

        if (loading) loadInboxMessages()
    }, [])

    const handleDeleteMessage = async (id, userName) => {
        try {
            let msj = `Desea eliminar el mensaje de ${userName}`
            if (confirm(msj)) {
                const res = await deleteMessage(id)
                if (res) {
                    setNotification({ error: '', exito: '' })
                    setTimeout(() => {
                        setNotification({ error: '', exito: '' })
                    }, 5000)
                    // en esta linea tuve que filtrar tanto por id como username
                    // ya que al borrar el ultimo mensaje de ese usuario me aparecia el siguiente
                    setMessages(messages.filter(m => m._id !== id && m.de.userName !== userName))
                }

            } else {
                return
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    if (loading) return <p>Cargando...</p>

    if (!messages || messages.length === 0) {
        return (
            <div className={styles.inbox}>
                <h1>Bandeja de entrada</h1>
                <p>No tiene mensajes!</p>
            </div>
        )
    }

    return (
        <div>
            <div>
                <h1 className={styles.inbox}>Bandeja de Entrada</h1>
            </div>
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
}

export default MessageList