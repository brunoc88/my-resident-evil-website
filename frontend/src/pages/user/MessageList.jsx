import { useState, useEffect } from "react"
import { useOutletContext, Link } from 'react-router-dom'
import { messageResumen } from "../../services/user"
import './MessageList.css'

const MessageList = () => {
    const { setNotificaiton } = useOutletContext()
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
                setNotificaiton({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotificaiton({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }

        if (loading) loadInboxMessages()
    }, [])

    if (loading) return <p>Cargando...</p>

    if (!messages || messages.length === 0) {
        return (
            <div>
                <h1>Bandeja de entrada</h1>
                <p>No tiene mensajes!</p>
            </div>
        )
    }

    return (
        <div>
            <div>
                <h1>Bandeja de Entrada</h1>
            </div>
            <div className="comments-container">
                {messages.map(m => (
                    <div key={m._id} className="comment-card">
                        <div className="comment-header">
                            <img src={`http://localhost:3000/uploads/${m.de.picture}`} alt="profile" className="profile-pic" />
                            <div className="comment-meta">
                                <Link to={`/user/perfil/${m.de.userName}`}>{m.de.userName}</Link>
                                <span className="date">{new Date(m.fecha).toLocaleDateString('es-AR')}</span>
                            </div>
                        </div>
                        <p className="comment-message">{m.mensaje}</p>
                        <div className="comment-options">
                            <Link to={`/user/mensajes/${m.de.id}`}className='action-link'>Responder</Link>
                            <span className='action-link'>Eliminar</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MessageList