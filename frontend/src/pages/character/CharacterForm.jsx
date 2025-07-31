import { useForm } from "react-hook-form"
import { useOutletContext, useParams } from "react-router-dom"
import CharacterInputs from "../../components/character/CharacterInputs"
import CharacterSelects from "../../components/character/CharacterSelects"
import { characterPost, getCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"


const CharacterForm = ({editMode}) => {
    const { id } = useParams()
    const { navigate } = useAuth()
    const { setNotification } = useOutletContext()
    const [loading, setLoading] = useState(true)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];

    useEffect(() => {
        try {
            if (!id) return
            const loadCharacterForm = async () => {
                const character = await getCharacterById(id)
                if (character) {
                    reset({
                        id: character.id,
                        nombre: character.nombre,
                        categoria: character.categoria,
                        condicion: character.condicion,
                        primeraAparicion: character.primeraAparicion,
                        ultimaAparicion: character.ultimaAparicion,
                        picture: character.picture,
                        fechaNacimiento: character.fechaNacimiento ? formatDate(character.fechaNacimiento) : "",
                        edad: character.edad,
                        peso: character.peso,
                        altura: character.altura,
                        colorOjos: character.colorOjos,
                        colorPelo: character.colorPelo,
                        oficio: character.oficio,
                        biografia: character.biografia
                    })
                }
            }
            loadCharacterForm()
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema: ${error}` })
        } finally {
            setLoading(false)
        }
    }, [id])

    const onSubmit = async (data) => {
        const formData = new FormData()

        // obligatorios
        formData.append('nombre', data.nombre)
        formData.append('categoria', data.categoria)
        formData.append('condicion', data.condicion)
        formData.append('primeraAparicion', data.primeraAparicion)
        formData.append('ultimaAparicion', data.ultimaAparicion)
        formData.append('picture', data.picture[0])
        // opcionales
        if (data.fechaNacimiento) formData.append('fechaNacimiento', data.fechaNacimiento)
        if (data.edad) formData.append('edad', data.edad)
        if (data.peso) formData.append('peso', data.peso)
        if (data.altura) formData.append('altura', data.altura)
        if (data.colorOjos) formData.append('colorOjos', data.colorOjos)
        if (data.colorPelo) formData.append('colorPelo', data.colorPelo)
        if (data.oficio) formData.append('oficio', data.oficio)
        if (data.biografia) formData.append('biografia', data.biografia)

        try {
            console.log("try-catch")
            const res = await characterPost(formData)
            console.log(res)
            setNotification({ error: '', exito: res.msj })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)

            navigate('/personajes/index')
        } catch (error) {
            setNotification({ error: error.message, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    if(loading) return <p> Cargando...</p>

    return (

        <div className="user-form-layout">
            <img src="/cForm.jpg" alt="Derecha" className="side-image right" />
            <form className="formulario" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <h1>Formulario de Personaje</h1>
                <div>
                    <CharacterInputs register={register} watch={watch} reset={reset} errors={errors} editMode={editMode} />
                </div>
                <div>
                    <CharacterSelects register={register} watch={watch} reset={reset} errors={errors} />
                </div>
                <div className="botones">
                    <button type="submit">Enviar</button>
                    <button type="button" onClick={() => history.back()}>Volver</button>
                </div>
            </form>
        </div>
    )
}

export default CharacterForm