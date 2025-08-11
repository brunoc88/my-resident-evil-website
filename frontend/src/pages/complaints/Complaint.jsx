import { useParams, useSearchParams, useOutletContext } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motivoValidation, mensajeValidation } from "../../utils/complaintValidations"
import { useAuth } from "../../context/AuthContext"
import { makeComplaint } from "../../services/complaints"
import { useEffect, useState } from "react"
import { userProfile } from "../../services/user"

const Complaint = () => {
    const { personaje, userName, id } = useParams()
    const { setNotification } = useOutletContext()
    const { navigate } = useAuth()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({ mode: 'onChange' })
    const [isActive, setIsActive] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams();
    const fromCharacter = searchParams.get("fromCharacter")

    let mensaje = watch('mensaje', '')
    let motivo = watch('motivo', '')

    useEffect(() => {
        if ((userName && id) || (personaje && id)) return
        navigate('/login');
    }, [userName, personaje, id, navigate]);

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

    const handleBackTo = () => {
        if (fromCharacter) {
            navigate(`/personajes/${fromCharacter}`)
        } else if (personaje) {
            navigate(`/personajes/${id}`)
        } else {
            navigate(`/user/perfil/${userName}`)
        }
    }

    if (userName && !isActive && !loading) {
        return (
            <div className="user-form-layout">
                <div className="formulario">
                    <h1>Cuenta eliminada</h1>
                    <p>Lo sentimos, pero la cuenta que intenta denunciar ha sido eliminada.</p>
                    <div className="botones">
                        <button onClick={handleBackTo}>Volver</button>
                    </div>
                </div>
            </div>
        )
    }

    if (userName && loading) return <p>Cargando...</p>

    return (
        <div className="user-form-layout">
            <div className="formulario">
                <h1>Realice su denuncia:</h1>
                <p>Complete el formulario para reportar un usuario o personaje.</p>
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <input type="hidden" {...register("tipo")} defaultValue={userName ? "User" : "Personaje"} />
                    <input type="hidden" {...register("id")} defaultValue={id} />

                    <div className="campo">
                        <label htmlFor="motivo">Motivo:</label>
                        <input
                            type="text"
                            id="motivo"
                            placeholder="Ingrese su motivo..."
                            {...register('motivo', motivoValidation)}
                        />
                        <div className="contador">{motivo.length}/100</div>
                        {errors.motivo && <span>{errors.motivo.message}</span>}
                    </div>

                    <div className="campo">
                        <label htmlFor="mensaje">Mensaje:</label>
                        <textarea
                            id="mensaje"
                            placeholder="Escriba su denuncia..."
                            {...register('mensaje', mensajeValidation)}
                        />
                        <div className="contador">{mensaje.length}/500</div>
                        {errors.mensaje && <span>{errors.mensaje.message}</span>}
                    </div>

                    <div className="botones">
                        <button type="submit">Enviar</button>
                        <button type="button" onClick={handleBackTo}>Volver</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Complaint
