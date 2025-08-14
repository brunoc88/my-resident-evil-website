import { useParams, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import CharacterComments from "../../components/character/Charactercomments"
import { getCharacterById, sendLike, sendUnlike, deleteCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { FaThumbsUp, FaRegComment } from "react-icons/fa"
import styles from './CharacterProfile.module.css'

const CharacterProfile = () => {
    const { id } = useParams()
    const [character, setCharacter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [litteNote, setLittleNote] = useState({ comentarios: '', likes: '' })
    const [plus, setPlus] = useState(false)
    const [likes, setLikes] = useState(null)
    const [liked, setLiked] = useState(false)
    const [comments, setComments] = useState(null)
    const [verComments, setVerComments] = useState(false)
    const { isAuth, user, navigate } = useAuth()
    const { setNotification } = useOutletContext()

    useEffect(() => {
        const loadCharacter = async () => {
            try {
                const res = await getCharacterById(id)
                setCharacter(res)
                setLikes(res.likes.length)
                const comentarios = res.comentarios.filter(c => c.estado)
                setComments(comentarios.length)
            } catch (error) {
                setNotification({ error: error.message })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }
        loadCharacter()
    }, [id])

    useEffect(() => {
        if (!character || !character.likes || !user?.id) return
        const myLike = character.likes.some(l => {
            const likeId = l?._id?.toString?.() || l?.toString?.()
            return likeId === user.id.toString()
        })
        if (myLike) setLiked(true)
    }, [character, user])

    if (loading) return <p>Cargando...</p>
    if (!character) return <p>Personaje no encontrado.</p>

    const handleLike = async () => {
        try {
            setLittleNote({ comentarios: '', likes: '' })
            if (isAuth) {
                if (!liked) {
                    setLiked(true)
                    setLikes(prev => prev + 1)
                    const res = await sendLike(character.id)
                    if (res && res.likes) {
                        setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
                    }
                } else {
                    setLiked(false)
                    setLikes(prev => prev - 1)
                    await sendUnlike(character.id)
                }
            } else {
                setLittleNote({ comentarios: '', likes: 'Debes logearte o registrarte para dar like!' })
                setTimeout(() => setLittleNote({ comentarios: '', likes: '' }), 5000)
            }
        } catch (error) {
            setNotification({ error: error.message })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    const handleVerComentarios = () => {
        setLittleNote('')
        if (!isAuth) {
            setLittleNote({ comentarios: 'Registrate o Logeate para ver los comentarios', likes: '' })
            setTimeout(() => setLittleNote(''), 5000)
        }
        setVerComments(prev => isAuth ? !prev : false)
    }

    const handleDeleteCharacter = async () => {
        try {
            if (confirm('Seguro que quiere eliminar este personaje?')) {
                const res = await deleteCharacterById(id)
                if (res) {
                    setNotification({ error: '', exito: 'Personaje eliminado!' })
                    setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
                    navigate('/personajes/index')
                }
            }
        } catch (error) {
            setNotification({ error: error.message, exito: '' })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    const handleEditCharacterViewForm = () => {
        navigate(`/personajes/editar/${id}`)
    }

    const handleMakeComplaint = () => {
        navigate(`/denuncias/crear/personaje/${character.nombre}/${character.id}`)
    }

    return (
        <div className={styles.characterContainer}>
            <h1 className={styles.allWhite}>{character.nombre}</h1>

            {litteNote.likes && <div className={styles.note}>{litteNote.likes}</div>}

            <div className={styles.characterContent}>
                {/* Imagen + Iconos */}
                <div className={styles.card}>
                    <img
                        src={`http://localhost:3000/uploads/${character.picture}`}
                        alt={`profile${character.nombre}`}
                        className={styles.characterImg}
                    />
                    <div className={styles.iconStats}>
                        <span
                            onClick={handleLike}
                            className={`${styles.likeIcon} ${liked ? styles.likeIconLiked : styles.likeIconNotLiked}`}
                        >
                            <FaThumbsUp /> {likes}
                        </span>
                        <span>
                            <FaRegComment onClick={handleVerComentarios} /> {comments}
                        </span>
                    </div>
                </div>

                {/* Datos + Botones */}
                <div className={styles.characterDetails}>
                    <table>
                        <tbody>
                            <tr><td>Nombre: {character.nombre}</td></tr>
                            <tr><td>Fecha de Nacimiento: {new Date(character.fechaNacimiento).toLocaleDateString('es-AR')}</td></tr>
                            <tr><td>Edad: {character.edad || 'sin datos'}</td></tr>
                            <tr><td>Color de pelo: {character.colorPelo || 'sin datos'}</td></tr>
                            <tr><td>Color de ojos: {character.colorOjos || 'sin datos'}</td></tr>
                            <tr><td>Altura: {character.altura ? `${character.altura} cm` : 'sin datos'}</td></tr>
                            <tr><td>Peso: {character.peso ? `${character.peso} Kg` : 'sin datos'}</td></tr>
                            {plus && (
                                <>
                                    <tr><td>Categoria: {character.categoria}</td></tr>
                                    <tr><td>Condicion: {character.condicion}</td></tr>
                                    <tr><td>Primera Aparicion: {character.primeraAparicion}</td></tr>
                                    <tr><td>Ultima Aparicion: {character.ultimaAparicion}</td></tr>
                                    <tr><td>Oficio: {character.oficio || 'sin datos'}</td></tr>
                                    <tr><td>Biografia: {character.biografia || 'sin datos'}</td></tr>
                                </>
                            )}
                        </tbody>
                    </table>

                    <button
                        className={styles.plusButton}
                        onClick={() => setPlus(prev => !prev)}
                    >
                        {plus ? '-' : '+'}
                    </button>

                    <div className={styles.actionButtons}>
                        {isAuth && (
                            <>
                                <button onClick={handleEditCharacterViewForm}>Editar</button>
                                <button onClick={handleMakeComplaint}>Denunciar</button>
                            </>
                        )}
                        {user?.rol === 'admin' && <button onClick={handleDeleteCharacter}>Eliminar</button>}
                    </div>

                    {litteNote.comentarios && <div className={styles.note}>{litteNote.comentarios}</div>}

                    <button className={styles.commentsButton} onClick={handleVerComentarios}>
                        {verComments && isAuth ? 'Ocultar' : 'Ver Comentarios'}
                    </button>
                </div>
            </div>

            {isAuth && verComments && (
                <div>
                    <CharacterComments id={id} setComments={setComments} />
                </div>
            )}
        </div>
    )
}

export default CharacterProfile
