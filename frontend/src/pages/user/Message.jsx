import { useForm } from 'react-hook-form'
import { useParams, useOutletContext } from 'react-router-dom'
import { sendMessage, getUsers, getChats } from '../../services/user'
import { useEffect, useState } from 'react'
import { mensajeValidation } from '../../utils/messageValidations'
//import './Message.css'

const Message = () => {
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onChange' })
    const { setNotification } = useOutletContext()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [chatMessages, setChatMessages] = useState([])
    const mensaje = watch('mensaje', '')

    // Este sería el id del usuario logueado
    const currentUserId = user ? user.id : null

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await getUsers()
                if (res) {
                    setUser(res.find(user => user.id === id))
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
        if (loading) loadUser()
    }, [])

    useEffect(() => {
        const loadChats = async () => {
            try {
                const res = await getChats(user.id)
                if (res && res.mensajes) setChatMessages(res.mensajes)
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (user) loadChats()
    }, [user])

    const onSubmit = async (data) => {
        try {
            const res = await sendMessage(id, data)
            if (res && res.msj) {
                setNotification({ error: '', exito: 'Mensaje enviado' })
                
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
                reset()
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    if (loading) return <p>Cargando...</p>

    return (
        <div className="header-chat">
            {user.picture && (
                <img
                    src={`http://localhost:3000/uploads/${user.picture}`} alt="profile" className="profile-pic" 
                />
            )}
                <h2>{user.userName}</h2>


                {/* Contenedor del chat */}
                <div className="chat-container">
                    {chatMessages.map(chat => {
                        const isSelf = chat.usuario === currentUserId
                        return (
                            <div
                                key={chat._id}
                                className={`chat-message ${isSelf ? 'self' : 'other'}`}
                            >
                                <div>
                                    <p>{chat.mensaje}</p>
                                    <div className="chat-meta">
                                        {new Date(chat.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <input type="hidden" {...register("id")} defaultValue={id} />
                    <div>
                        <textarea
                            id="mensaje"
                            {...register('mensaje', mensajeValidation)}
                        ></textarea>
                        <div>{mensaje.length}/280</div>
                        {errors.mensaje && <span>{errors.mensaje.message}</span>}
                    </div>
                    <div>
                        <button type='submit'>
                            {chatMessages.length > 0 ? 'Responder' : 'Enviar'}
                        </button>
                    </div>
                </form>
        </div>
    )
}

export default Message
