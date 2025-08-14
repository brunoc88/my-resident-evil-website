import { useForm } from 'react-hook-form'
import { useParams, useOutletContext, Link } from 'react-router-dom'
import { sendMessage, getUsers, getChats } from '../../services/user'
import { useEffect, useState } from 'react'
import { mensajeValidation } from '../../utils/messageValidations'
import { useAuth } from '../../context/AuthContext'
import './Message.css'

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
    const { user, navigate } = useAuth()
    const [userToChat, setUserToChat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [chatMessages, setChatMessages] = useState([])
    const [imBlock, setImBlock] = useState(null)
    const [isBlock, setIsBlock] = useState(null)
    const [isActive, setIsActive] = useState(null)
    const mensaje = watch('mensaje', '')

    // Este sería el id del usuario logueado
    const currentUserId = userToChat ? userToChat.id : null

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await getUsers()
                if (res) {
                    const userFilter = res.find(user => user.id === id)
                    console.log('user', userFilter)
                    if (userFilter && userFilter.estado === true) {
                        setUserToChat(userFilter)
                        setIsActive(true)
                    } else {
                        setIsActive(false)
                    }

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
                const res = await getChats(userToChat.id)
                if (res && res.mensajes) setChatMessages(res.mensajes.filter(m => m.estado))
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (userToChat) loadChats()
    }, [userToChat])


    useEffect(() => {
        const checkBlockInfo = () => {
            if (user.bloqueos.includes(userToChat.id)) {
                setIsBlock(true)
            } else {
                setIsBlock(false)
            }

            if (userToChat.bloqueos.includes(user.id)) {
                setImBlock(true)
            } else {
                setImBlock(false)
            }
        }
        if (user && userToChat) checkBlockInfo()
    }, [user, userToChat])



    const onSubmit = async (data) => {
        try {
            const res = await sendMessage(id, data)
            if (res && res.msj) {
                const update = await getChats(userToChat.id)
                if (update && update.mensajes) {
                    setChatMessages(update.mensajes.filter(m => m.estado))
                }

                reset()
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    const handleBackToInbox = () => { // <-- bandeja de mensajes
        navigate('/user/mensajes/resumen')
    }

    if (loading) return <p>Cargando...</p>

    if (!isActive) return (
        <div>
            <h1>Lo sentimos, cuenta eliminada o inactiva!</h1>
            <button onClick={handleBackToInbox}>Volver</button>
        </div>
    )
    return (
        <div className="header-chat">
            {userToChat.picture && (
                <img
                    src={`http://localhost:3000/uploads/${userToChat.picture}`} alt="profile" className="profile-pic"
                />
            )}
            <Link to={`/user/perfil/${userToChat.userName}`}><h2>{userToChat.userName}</h2></Link>

            <div>
                {isBlock
                    ? 'Bloqueaste a este usuario'
                    : imBlock && 'Has sido bloqueado'}
            </div>

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
                    {(!isBlock && !imBlock && isActive) && (
                        <>
                            <textarea
                                id="mensaje"
                                {...register('mensaje', mensajeValidation)}
                            ></textarea>
                            <div>{mensaje.length}/280</div>
                            {errors.mensaje && <span>{errors.mensaje.message}</span>}
                        </>
                    )}
                </div>
                <div>
                    {!isBlock && !imBlock && isActive && (
                        <button type='submit'>
                            {chatMessages.length > 0 ? 'Responder' : 'Enviar'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Message
