import { useForm } from 'react-hook-form'
import { useParams, useOutletContext } from 'react-router-dom'
import { sendMessage, userProfile } from '../../services/user'
import { useEffect, useState } from 'react'
import { mensajeValidation } from '../../utils/messageValidations'

const Message = () => {
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({ mode: 'onChange' })
    const { setNotificaiton } = useOutletContext()
    const [user, setUser] = useState(null)
    //const [chatMessages, setChatMessages] = useState(null)
    const mensaje = watch('mensaje', '')

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await userProfile(id)
                if (res && res.user) {
                    setUser(res.user)
                }
            } catch (error) {
                setNotificaiton({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotificaiton({ error: '', exito: '' })
                }, 5000)
            }
        }
        loadUser()
    }, [id])


    const onSubmit = async (data) => {
        try {
            const res = await sendMessage(id, data)
            if (res && res.msj) {
                setNotificaiton({ error: '', exito: 'Mansaje enviado' })
                setTimeout(() => {
                    setNotificaiton({ error: '', exito: '' })
                }, 5000)
            }
        } catch (error) {
            setNotificaiton({ error: error.message || `hubo un problema ${error}`, exito: '' })
            setTimeout(() => {
                setNotificaiton({ error: '', exito: '' })
            }, 5000)
        }
    }
    return (
        <div>
            <div>
                {user.userName}
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