import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import './CharacterProfile.css'


const CharacterProfile = () => {
    const { id } = useParams()
    const [character, setCharacter] = useState(null)
    const [loading, setLoading] = useState(true)
    const [litteNote, setLittleNote] = useState('')
    const [plus, setPlus] = useState(false)
    const { isAuth, user } = useAuth()

    useEffect(() => {
        const loadCharacter = async () => {
            try {
                const res = await getCharacterById(id)
                setCharacter(res)
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

    const handleVerComentarios = () => {
        if(!isAuth){
            setLittleNote('Registrate o Logeate para ver los mensajes')
        }
    }

    return (
        <div>
            <div>
                <h1>{character.nombre}</h1>
                {/* aca van a ir icon like + numero de likes + icon comentario + numero de comentarios*/}
            </div>
            <div>
                <div className="card">
                    <img
                        src={`http://localhost:3000/uploads/${character.picture}`}
                        alt={`profile${character.nombre}`}
                        className="character-img"
                    />
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Nombre: {character.nombre}</td>
                            </tr>
                            <tr>
                                <td>Fecha de Nacimiento: {character.fechaNacimiento}</td>
                            </tr>
                            <tr>
                                <td>Edad: {character.edad ? `${character.edad} años` : 'sin datos'}</td>
                            </tr>
                            <tr>
                                <td>Color de pelo: {character.colorPelo ? character.colorPelo : 'sin datos'}</td>
                            </tr>
                            <tr>
                                <td>Color de ojos: {character.colorOjos ? character.colorOjos : 'sin datos'}</td>
                            </tr>
                            <tr>
                                <td>Peso: {character.peso ? `${character.peso} Kg` : 'sin datos'}</td>
                            </tr>
                            {!plus &&
                                <button onClick={() => setPlus(true)}>
                                    +
                                </button>
                            }
                            {plus &&
                                <div>
                                    <tr>
                                        <td>
                                            Categoria: {character.categoria}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Condicion: {character.condicion}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Primera Aparicion: {character.primeraAparicion}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Ultima Aparicion: {character.ultimaAparicion}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Oficio: {character.oficio ? character.oficio : 'sin datos'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Condicion: {character.condicion}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Biografia: {character.biografia ? character.biografia : 'sin datos'}
                                        </td>
                                    </tr>
                                </div>
                            }
                        </tbody>
                    </table>
                    <div>
                        {isAuth &&
                            < div >
                                <button>Editar</button>
                                <button>Denunciar</button>
                            </div>
                        }
                        {user && user.rol === 'admin'? 
                        <button>Eliminar</button>:''
                    }
                    </div>
                </div>
                <div><span>{litteNote?litteNote:''}</span></div>
                <div>
                    <button onClick={handleVerComentarios}>Ver comentarios</button>
                </div>
            </div>
        </div >
    )
}

export default CharacterProfile
