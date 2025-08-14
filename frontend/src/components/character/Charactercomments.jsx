import { useForm } from 'react-hook-form'
import { useOutletContext, Link } from 'react-router-dom'
import { comentValidation } from '../../utils/commentValidations.js'
import { postComment, getComments, deleteCommentById, editCommentById } from '../../services/character.js'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './CharacterComments.module.css'

const CharacterComments = ({ id, setComments }) => {
    const [allComments, setAllComments] = useState(null)
    const [editComment, setEditComment] = useState(false)
    const [visibleComments, setVisibleComments] = useState(2)
    const { setNotification } = useOutletContext()
    const { user, navigate } = useAuth()

    useEffect(() => {
        const loadComments = async () => {
            try {
                const res = await getComments(id)
                setAllComments(res.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
            } catch (error) {
                setNotification({ error: error.message, exito: '' })
                setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
            }
        }
        if (!allComments) loadComments()
    }, [allComments, id, setNotification])

    const { reset, register, watch, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' })
    let mensaje = watch('mensaje', '')

    const onSubmit = async (data) => {
        try {
            const res = await postComment(id, data)
            if (res) {
                setComments(prev => prev + 1)
                setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
                reset()
                const updated = await getComments(id)
                setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
                setVisibleComments(2)
            }
        } catch (error) {
            setNotification({ error: error.message, exito: '' })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    const handleDeleteComment = async (idComentario) => {
        try {
            if (confirm('Desea eliminar este comentario?')) {
                const res = await deleteCommentById(id, idComentario)
                if (res) {
                    const updated = await getComments(id)
                    setComments(prev => prev - 1)
                    setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
                    setVisibleComments(2)
                    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
                }
            }
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema:${error}` })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    const getMyComment = (comment) => {
        reset({ id: comment._id, mensaje: comment.mensaje })
        setEditComment(true)
    }

    const handleEditComment = async (data) => {
        try {
            const res = await editCommentById(id, data.id, data)
            if (res) {
                
                reset({ mensaje: '' })
                const updated = await getComments(id)
                setAllComments(updated.comentario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))
                setEditComment(false)
                setVisibleComments(2)
                setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
            }
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema:${error}` })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    const handleMakeComplaintUser = (idUsuario, userName) => {
        navigate(`/denuncias/crear/usuario/${userName}/${idUsuario}?fromCharacter=${id}`)
    }

    return (
        <div className={styles.commentSection}>
            <hr />
            <form onSubmit={handleSubmit(editComment ? handleEditComment : onSubmit)} className={styles.commentForm}>
                <label htmlFor="mensaje">Comentario:</label>
                <textarea {...register('mensaje', comentValidation)} id="mensaje" placeholder="ingresa un comentario..."></textarea>

                <div className={styles.formFooter}>
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
                        {allComments.slice(0, visibleComments).map(c => (
                            <div key={c._id} className={styles.commentCard}>
                                <div className={styles.commentHeader}>
                                    <img src={`http://localhost:3000/uploads/${c.usuario.picture}`} alt="profile" className={styles.profilePic} />
                                    <div className={styles.commentMeta}>
                                        <Link to={`/user/perfil/${c.usuario.userName}`} className={styles.actionLink}>{c.usuario.userName}</Link>
                                        <span className={styles.date}>{new Date(c.fecha).toLocaleDateString('es-AR')}</span>
                                    </div>
                                </div>
                                <p className={styles.commentMessage}>{c.mensaje}</p>
                                <div className={styles.commentOptions}>
                                    {user.id === c.usuario.id && <span onClick={() => getMyComment(c)} className={styles.actionLink}>Editar</span>}
                                    {(user?.id === c.usuario.id || (user?.rol === 'admin' && c.usuario.rol !== 'admin')) &&
                                        <span onClick={() => handleDeleteComment(c._id)} className={styles.actionLink}>Eliminar</span>}
                                    {user.id !== c.usuario.id && <span onClick={() => handleMakeComplaintUser(c.usuario.id, c.usuario.userName)} className={styles.actionLink}>Denunciar</span>}
                                </div>
                            </div>
                        ))}

                        {visibleComments < allComments.length &&
                            <button className={styles.verMasBtn} onClick={() => setVisibleComments(prev => prev + 2)}>
                                Ver más
                            </button>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default CharacterComments
