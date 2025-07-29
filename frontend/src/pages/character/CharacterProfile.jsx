import { useParams, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCharacterById, sendLike, sendUnlike } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { FaThumbsUp, FaRegComment } from "react-icons/fa"
import './CharacterProfile.css'


const CharacterProfile = () => {
    const { id } = useParams()
    const [character, setCharacter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [litteNote, setLittleNote] = useState({ comentarios: '', likes: '' })
    const [plus, setPlus] = useState(false)
    const [likes, setLikes] = useState(null) //<-- contador de likes
    const [liked, setLiked] = useState(false) //<-- si le di like o no
    const [comentarios, setComentarios] = useState(null)
    const { isAuth, user } = useAuth()
    const { setNotification } = useOutletContext()

    useEffect(() => {
        const loadCharacter = async () => {
            try {
                const res = await getCharacterById(id)
                setCharacter(res)
                setLikes(res.likes.length)
                setComentarios(res.comentarios.length)
            } catch (error) {
                console.error("Error al cargar personaje:", error)
            } finally {
                setLoading(false)
            }
        }

        loadCharacter()
    }, [id])

    if (loading) return <p>Cargando...</p>

    if (!character) return <p>Personaje no encontrado.</p>

    const handleLike = async () => {
        try {
            setLittleNote({ comentarios: '', likes: '' })
            if (isAuth) {
                if (!liked) {
                    setLiked(true)
                    setLikes(prev => prev + 1)
                    const id = character.id
                    const res = await sendLike(id)
                    if (res && res.likes) {
                        setNotification({ error: '', exito: 'Gracias por el like!' })
                        setTimeout(() => {
                            setNotification({ error: '', exito: '' })
                        }, 5000)
                    }
                } else {
                    setLiked(false)
                    setLikes(prev => prev - 1)
                    const id = character.id
                    await sendUnlike(id)
                }

            } else {
                setLittleNote({ comentarios: '', likes: 'Debes logearte o registrarte para dar like!' })
                setTimeout(() => {
                    setLittleNote({ comentarios: '', likes: '' })
                }, 5000)
            }

        } catch (error) {
            setNotification({ error: error.message })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    const handleVerComentarios = () => {
        setLittleNote('')
        if (!isAuth) {
            setLittleNote({ comentarios: 'Registrate o Logeate para ver los mensajes', likes: '' })
            setTimeout(() => {
                setLittleNote('')
            }, 5000)
        }
    }

    return (
        <div className="character-container">
            <h1>{character.nombre}</h1>
            {litteNote.likes && (
                <div className="note note-center">{litteNote.likes}</div>
            )}
            <div className="character-content">
                {/* COLUMNA: IMAGEN + ICONOS */}
                <div className="card">
                    <img
                        src={`http://localhost:3000/uploads/${character.picture}`}
                        alt={`profile${character.nombre}`}
                        className="character-img"
                    />
                    <div className="icon-stats">
                        <span onClick={handleLike} className={`like-icon ${liked ? 'liked' : 'not-liked'}`}>
                            <FaThumbsUp /> {likes}
                        </span>
                        <span><FaRegComment /> {comentarios}</span>
                    </div>

                </div>

                {/* COLUMNA: DATOS + BOTONES */}
                <div className="character-details">
                    <table>
                        <tbody>
                            <tr><td>Nombre: {character.nombre}</td></tr>
                            <tr><td>Fecha de Nacimiento: {character.fechaNacimiento}</td></tr>
                            <tr><td>Edad: {character.edad ? `${character.edad} años` : 'sin datos'}</td></tr>
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

                    {!plus ? (
                        <button className="plus-button" onClick={() => setPlus(true)}>+</button>
                    ) : <button className="plus-button" onClick={() => setPlus(false)}>-</button>}

                    <div className="action-buttons">
                        {isAuth && (
                            <>
                                <button>Editar</button>
                                <button>Denunciar</button>
                            </>
                        )}
                        {user?.rol === 'admin' && <button>Eliminar</button>}
                    </div>

                    {litteNote.comentarios && <div className="note">{litteNote.comentarios}</div>}

                    <button className="comments-button" onClick={handleVerComentarios}>Ver comentarios</button>
                </div>
            </div>
        </div>
    )

}

export default CharacterProfile
