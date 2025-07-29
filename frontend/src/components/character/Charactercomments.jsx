import { useForm } from 'react-hook-form'
import { comentValidation } from '../../utils/commentValidations.js'

const CharacterComments = ({ comments }) => {
    const {
        reset,
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    let mensaje = watch('mensaje', '')

    const onSubmit = (data) => {
        try {
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="comment-section">
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <label htmlFor="mensaje">Comentario:</label>
                    <textarea {...register('mensaje', comentValidation)} id="mensaje" placeholder="ingresa un comentario..." ></textarea>
                    <div>{mensaje.length}/200</div>
                    {errors.mensaje && <span>{errors.mensaje.message}</span>}
                </div>
                <div>
                    <button>Enviar</button>
                </div>
            </form>
            <div>
                {!comments || comments.length === 0 ? (
                    <h1>Se el primer comentario!</h1>) : ''}
            </div>
        </div>
    )
}

export default CharacterComments