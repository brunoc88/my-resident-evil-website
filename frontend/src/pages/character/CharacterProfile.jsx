import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { FaThumbsUp, FaRegComment } from "react-icons/fa"
import './CharacterProfile.css'


const CharacterProfile = () => {
    const { id } = useParams()
    const [character, setCharacter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [litteNote, setLittleNote] = useState('')
    const [plus, setPlus] = useState(false)
    const [likes, setLikes] = useState(null) //<-- contador de likes
    const [liked, setLiked] = useState(false) //<-- si le di like o no
    const [comentarios, setComentarios] = useState(null)
    const { isAuth, user } = useAuth()

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

    const handleLike = () => {
        if(!liked){
            setLiked(true)
            setLikes(prev => prev + 1)
        }
    }

    const handleVerComentarios = () => {
        if (!isAuth) {
            setLittleNote('Registrate o Logeate para ver los mensajes')
        }
    }

    return (
    <div className="character-container">
        <h1>{character.nombre}</h1>
        <div className="character-content">
            {/* COLUMNA: IMAGEN + ICONOS */}
            <div className="card">
                <img
                    src={`http://localhost:3000/uploads/${character.picture}`}
                    alt={`profile${character.nombre}`}
                    className="character-img"
                />
                <div className="icon-stats">
                    <span><FaThumbsUp /> {likes}</span>
                    <span><FaRegComment /> {comentarios} </span>
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

                {!plus && (
                    <button className="plus-button" onClick={() => setPlus(true)}>+</button>
                )}

                <div className="action-buttons">
                    {isAuth && (
                        <>
                            <button>Editar</button>
                            <button>Denunciar</button>
                        </>
                    )}
                    {user?.rol === 'admin' && <button>Eliminar</button>}
                </div>

                {litteNote && <div className="note">{litteNote}</div>}

                <button className="comments-button" onClick={handleVerComentarios}>Ver comentarios</button>
            </div>
        </div>
    </div>
)

}

export default CharacterProfile
