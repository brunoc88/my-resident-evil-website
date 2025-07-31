import { useForm } from 'react-hook-form'
import { emailValidation, preguntaValidation, respuestaValidation } from '../../utils/userValidation'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { passwordRecovery } from '../../services/user'
import './PasswordRecovery.css'

const PasswordRecovery = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const respuesta = watch('respuesta', '')

  const { setNotification } = useOutletContext()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
  try {
    const res = await passwordRecovery(data)
    if (res && res.msj) {
      setNotification({
        error: '',
        exito: (
          <>
            Password Provisional: {res.nuevaPassword}
            <br />
            Tiene 15 segundos antes que se borre
          </>
        )
      })

      setTimeout(() => {
        setNotification({ error: '', exito: '' })
      }, 15000)
      navigate('/login')
    }
  } catch (error) {
    setNotification({ error: error.message, exito: '' }) 
    setTimeout(() => {
      setNotification({ error: '', exito: '' }) 
    }, 5000)
  }
}

  const backToLogin = async () => {
    navigate('/login')
  }

  return (
    <div className="recovery-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="recovery-form-box">
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
        {errors.email && <span className='error'>{errors.email.message}</span>}

        <label htmlFor="pregunta">Seleccione una pregunta:</label>
        <div>
          <select id="pregunta" {...register('pregunta', preguntaValidation)}>
            <option value="">-- Elige una opción --</option>
            <option value="RE Favorito?">RE Favorito?</option>
            <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
            <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
          </select>

        </div>
        {errors.pregunta && <span className='error'>{errors.pregunta.message}</span>}

        <label htmlFor="respuesta">Respuesta:</label>
        <div>
          <input
            type="text"
            id="respuesta"
            placeholder="Ej: Resident Evil 3 de 1998"
            {...register('respuesta', respuestaValidation)}
          />
          <div>{respuesta.length}/60</div>
          {errors.respuesta && <span className='error'>{errors.respuesta.message}</span>}
        </div>

        <div>
          <button type="submit">Enviar</button>
          <button type="button" onClick={backToLogin}>Volver</button>
        </div>
      </form>
      <img
        src="/weskerRecovery.jpg"
        alt="Izquierda"
        className="side-image left"
      />
    </div>
  )
}

export default PasswordRecovery
