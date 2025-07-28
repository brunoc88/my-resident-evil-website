import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { characterList } from "../../services/character"
import ListCharacters from "../../components/character/ListCharacters"

const CharacterIndex = () => {
    const [characters, setCharacters] = useState(null)
    const { setNotification } = useOutletContext()

    useEffect(()=>{
        const loadCharacters = async () => {
            try {
                const res = await characterList()
                console.log("PERSONAJES",res)
                if(res && res.personajes) {
                    setCharacters(res.personajes)
                }
            } catch (error) {
                console.log(error)
                setNotification({error:error.message? error.message:`Hubo un problema: ${error}`})
                setTimeout(() => {
                    setNotification({error:'', exito:''})
                }, 5000)
            }
        }
        loadCharacters()
    }, [])

    return(
        <div>
            <div>
                <h1>Lista de Personajes</h1>
            </div>
            <div>
                <ListCharacters characters = {characters}/>
            </div>
        </div>
    )
}

export default CharacterIndex