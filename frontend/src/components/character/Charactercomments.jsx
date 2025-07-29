import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import { comentValidation } from '../../utils/commentValidations.js'
import { postComment, getComments } from '../../services/character.js'
import { useEffect, useState } from 'react'
import './CharacterComments.css'

const CharacterComments = ({ id }) => {
    const [allComments, setAllComments] = useState(null)

    useEffect(() => {
        const loadComments = async () => {
            try {
                const res = await getComments(id)
                setAllComments(res.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
            } catch (error) {
                setNotification({ error: error.message, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (!allComments) loadComments()
    }, [allComments])

    const {
        reset,
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    const { setNotification } = useOutletContext()

    let mensaje = watch('mensaje', '')

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const res = await postComment(id, data)
            if (res) {
                setNotification({ error: '', exito: 'Gracias por comentar!' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
                reset()
                const updated = await getComments(id)
                setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
            }
        } catch (error) {
            setNotification({ error: error.message, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }
    return (
        <div className="comment-section">
            <hr />
            <form onSubmit={handleSubmit(onSubmit)} className="comment-form">
                <label htmlFor="mensaje">Comentario:</label>
                <textarea
                    {...register('mensaje', comentValidation)}
                    id="mensaje"
                    placeholder="ingresa un comentario..."
                ></textarea>

                <div className="form-footer">
                    <button type="submit">Enviar</button>
                    <span>{mensaje.length}/200</span>
                </div>

                {errors.mensaje && <span>{errors.mensaje.message}</span>}
            </form>
            <div>
                {!allComments || allComments.length === 0 ? (
                    <h1>¡Sé el primer comentario!</h1>
                ) : (
                    <div className="comments-container">
                        {allComments?.map((c) => (
                            <div key={c._id} className="comment-card">
                                <div className="comment-header">
                                    <img src={`http://localhost:3000/uploads/${c.usuario.picture}`} alt="profile" className="profile-pic" />
                                    <div className="comment-meta">
                                        <span className="username">{c.usuario.userName}</span>
                                        <span className="date">{new Date(c.fecha).toLocaleDateString('es-AR')}</span>
                                    </div>
                                </div>
                                <p className="comment-message">{c.mensaje}</p>
                                <div className="comment-options">
                                    <span>Editar</span>
                                    <span>Eliminar</span>
                                    <span>Denunciar</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default CharacterComments