import { useForm } from 'react-hook-form'
import { useOutletContext, Link } from 'react-router-dom'
import { comentValidation } from '../../utils/commentValidations.js'
import { postComment, getComments, deleteCommentById } from '../../services/character.js'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './CharacterComments.css'

const CharacterComments = ({ id, setComments }) => {
    const [allComments, setAllComments] = useState(null)
    const { setNotification } = useOutletContext()
    const { user } = useAuth()

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
    }, [allComments, id, setNotification])

    const {
        reset,
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    let mensaje = watch('mensaje', '')

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const res = await postComment(id, data)
            if (res) {
                setNotification({ error: '', exito: 'Gracias por comentar!' })
                setComments(prev => prev + 1)
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

    const handleDeleteComment = async (idComentario) => {
        try {
            let msj = 'Desea eliminar este comentario?'
            if (confirm(msj)) {
                const res = await deleteCommentById(id, idComentario)
                if (res) {
                    setNotification({ error: '', exito: 'Mensaje eliminado!' })
                    const updated = await getComments(id)
                    setComments(prev => prev - 1)
                    setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
                    setTimeout(() => {
                        setNotification({ error: '', exito: '' })
                    }, 5000)
                }
            }
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema:${error}` })
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
                                        <Link to={`user/perfil/${c.usuario.id}`} className='action-link'>{c.usuario.userName}</Link>
                                        <span className="date">{new Date(c.fecha).toLocaleDateString('es-AR')}</span>
                                    </div>
                                </div>
                                <p className="comment-message">{c.mensaje}</p>
                                <div className="comment-options">
                                    {user.id === c.usuario.id && <span className='action-link'>Editar</span>}
                                    {user.id === c.usuario.id && <span onClick={() => handleDeleteComment(c._id)} className='action-link'>Eliminar</span>}
                                    {user.id !== c.usuario.id && <span className='action-link'>Denunciar</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div >
    )
}

export default CharacterComments