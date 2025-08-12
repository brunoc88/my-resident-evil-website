import { useForm } from 'react-hook-form'
import { useParams, useOutletContext } from 'react-router-dom'
import { sendMessage, getUsers } from '../../services/user'
import { useEffect, useState } from 'react'
import { mensajeValidation } from '../../utils/messageValidations'

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
    //const [chatMessages, setChatMessages] = useState(null)
    const mensaje = watch('mensaje', '')

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
            }finally{
                setLoading(false)
            }
        }
        if(loading) loadUser()
    }, [])


    const onSubmit = async (data) => {
        try {
            const res = await sendMessage(id, data)
            if (res && res.msj) {
                setNotification({ error: '', exito: 'Mansaje enviado' })
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

    if(loading) return <p>Cargando...</p>
    return (
        <div>
            <div>
                 <h2>{user.userName}</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div>
                        <input type="hidden" {...register("id")} defaultValue={id} />
                    </div>
                    <div>
                        <textarea id="mensaje"
                            {...register('mensaje', mensajeValidation)}
                        ></textarea>
                        <div className="">{mensaje.length}/280</div>
                        {errors.mensaje && <span>{errors.mensaje.message}</span>}
                    </div>
                    <div>
                        <button type='submit'>Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Message