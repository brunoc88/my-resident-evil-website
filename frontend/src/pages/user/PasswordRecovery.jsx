import { useForm } from 'react-hook-form'
import { emailValidation, preguntaValidation, respuestaValidation } from '../../utils/userValidation'


const PasswordRecovery = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const respuesta = watch('respuesta', '')

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} method="post">
        <div>
          <h1>Recupera tu Password!</h1>
        </div>

        <label htmlFor="email">Email:</label>
        <div>
          <input
            type="text"
            id="email"
            placeholder="Ej: re@gmail.com"
            {...register('email', emailValidation)}
          />
          
        </div>
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="pregunta">Seleccione una pregunta:</label>
        <div>
          <select id="pregunta" {...register('pregunta', preguntaValidation)}>
            <option value="">-- Elige una opción --</option>
            <option value="RE Favorito?">RE Favorito?</option>
            <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
            <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
          </select>
          
        </div>
        {errors.pregunta && <span>{errors.pregunta.message}</span>}

        <label htmlFor="respuesta">Respuesta:</label>
        <div>
          <input
            type="text"
            id="respuesta"
            placeholder="Ej: Resident Evil 3 de 1998"
            {...register('respuesta', respuestaValidation)}
          />
          <div>{respuesta.length}/60</div>
          {errors.respuesta && <span>{errors.respuesta.message}</span>}
        </div>

        <div>
          <button type="submit">Enviar</button>
          <button type="button" onClick={() => history.back()}>Volver</button>
        </div>
      </form>
    </div>
  )
}

export default PasswordRecovery
