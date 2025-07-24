import { useForm } from "react-hook-form"
import CharacterInputs from "../../components/character/CharacterInputs"
import CharacterSelects from "../../components/character/CharacterSelects"


const CharacterForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Formulario de Personaje</h1>
                <div>
                    <CharacterInputs register={register} watch={watch} reset={reset} errors={errors} />
                </div>
                <div>
                    <CharacterSelects register={register} watch={watch} reset={reset} errors={errors}/>
                </div>
                <div>
                    <button type="submit">Enviar</button>
                    <button type="button" onClick={() => history.back()}>Volver</button>
                </div>
            </form>
        </div>
    )
}

export default CharacterForm