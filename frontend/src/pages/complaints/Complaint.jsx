import { useParams, useOutletContext } from "react-router-dom"
import { useForm } from "react-hook-form"
import { motivoValidation, mensajeValidation } from "../../utils/complaintValidations"
import { useAuth } from "../../context/AuthContext"
import { makeComplaint } from "../../services/complaints"
import { useEffect } from "react"

const Complaint = () => {
    const { personaje, userName, id } = useParams() // <-- aca vamos a extraer de la app.jsx 
    // si el parametro es personaje osea si no es null hacemos la denuncia del personaje
    // sino hacemos la denuncia de un usaurio
    //const [loading, setLoading] = useState(true)
    const { setNotification } = useOutletContext()
    const { navigate } = useAuth()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    let mensaje = watch('mensaje', '')
    let motivo = watch('motivo', '')

    useEffect(() => {
        // Caso: denuncia a usuario
        if (userName && id) return;

        // Caso: denuncia a personaje
        if (personaje && id) return;

        // Si no entra en ninguno de los dos casos, manda a login
        navigate('/login');
    }, [userName, personaje, id, navigate]);


    const onSubmit = async (data) => {
        try {
            const res = await makeComplaint(data)
            if (res) {
                setNotification({ error: '', exito: 'Denuncia Realizada' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
                handleBackTo()
            }
        } catch (error) {
            setNotification({ error: error.message ? error.message : `Hubo un problema: ${error}` })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    const handleBackTo = () => {
        if (userName) {
            navigate(`/user/perfil/${userName}`)
        } else {
            navigate(`/personajes/${id}`)
        }
    }


    
    return (
        <div>
            <div>
                <h1>Realice su denuncia:</h1>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div>
                        <input type="hidden" {...register("tipo")} defaultValue={userName ? "User" : "Personaje"} />
                        <input type="hidden" {...register("id")} defaultValue={id} />
                    </div>
                    <div>
                        <label htmlFor="motivo">Motivo:</label>
                        <input type="text"
                            id="motivo"
                            placeholder="Ingrese su motivo..."
                            {...register('motivo', motivoValidation)} />
                        <div className="">{motivo.length}/100</div>
                        {errors.motivo && <span>{errors.motivo.message}</span>}
                    </div>
                    <div>
                        <label htmlFor="mensaje">Mensaje:</label>
                        <textarea name="mensaje"
                            id="mensaje"
                            placeholder="Escriba su denuncia..."
                            {...register('mensaje', mensajeValidation)}
                        />
                        <div className="">{mensaje.length}/500</div>
                        {errors.mensaje && <span>{errors.mensaje.message}</span>}
                    </div>
                    <div>
                        <button type="submit">Enviar</button>
                        <button onClick={handleBackTo}>Volver</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Complaint