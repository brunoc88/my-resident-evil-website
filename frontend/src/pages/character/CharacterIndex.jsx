import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { characterList } from "../../services/character"
import ListCharacters from "../../components/character/ListCharacters"
import './CharacterIndex.css'

const CharacterIndex = () => {
    const [characters, setCharacters] = useState(null)
    const [filter, setFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const { setNotification } = useOutletContext()

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const res = await characterList()
                if (res && res.personajes) {
                    setCharacters(res.personajes)
                }
            } catch (error) {
                console.log(error)
                setNotification({ error: error.message ? error.message : `Hubo un problema: ${error}` })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }
        loadCharacters()
    }, [setNotification, loading])


    const handleFilter = (e) => {
        const value = e.target.value.trim()
        if (!value) {
            setFilter(null) // Resetear si el input está vacío
            return
        }
        const filtered = characters.filter(c => c.nombre.toLowerCase().includes(value.toLowerCase()))
        setFilter(filtered)
    }

    if(loading) return <p>Cargando...</p>
    return (
        <div>
            <div>
                <h1>Lista de Personajes</h1>
            </div>
            <div className="filter">
                {characters && <input type="text"
                    placeholder="Ingrese un nombre..."
                    onChange={handleFilter}
                    id="filter"
                />}
            </div>
            <div>
                <ListCharacters characters={filter ? filter : characters} />
            </div>
        </div>
    )
}

export default CharacterIndex