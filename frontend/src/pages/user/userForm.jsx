import { useForm } from 'react-hook-form'
import {
  userNameValidation,
  passwordValidation,
  password2Validation,
  emailValidation,
  preguntaValidation,
  sobreMiValidation,
  respuestaValidation
} from '../../utils/userValidation'

import './UserForm.css'

const UserForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const sobreMi = watch('sobreMi', '')
  const respuesta = watch('respuesta', '')
  const userName = watch('userName', '')

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <div className="user-form-layout">
      <img
        src="/leonForm.jpg"
        alt="Izquierda"
        className="side-image left"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="formulario">
        <h1>Formulario de Usuario</h1>
        <p>¿Te unes a la R.P.D o a Umbrella?</p>

        <div className="grid">
          <div className="campo">
            <label htmlFor="userName">Nombre de Usuario:</label>
            <input
              id="userName"
              {...register('userName', userNameValidation)}
              placeholder="Ej: adaWong88"
              type='text'
            />
            <div className="contador">{userName.length}/10</div>
            {errors.userName && <span>{errors.userName.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              {...register('password', passwordValidation)}
              placeholder="Ingrese un password"
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="text"
              {...register('email', emailValidation)}
              placeholder="Ej: capcom@gmail.com"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password2">Confirmar Password:</label>
            <input
              id="password2"
              type="password"
              {...register('password2', password2Validation(watch))}
              
            />
            {errors.password2 && <span>{errors.password2.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pregunta">Selecciona una Pregunta:</label>
            <select
              id="pregunta"
              {...register('pregunta', preguntaValidation)}
            >
              <option value="">-- Elige una opción --</option>
              <option value="RE Favorito?">RE Favorito?</option>
              <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
              <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
            </select>
            {errors.pregunta && <span>{errors.pregunta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="sobreMi">Escribe un poco sobre ti:</label>
            <textarea
              id="sobreMi"
              {...register('sobreMi', sobreMiValidation)}
              placeholder='Ej: Amo jugar Resident Evil, los juego desde que salio la PlayStation'
            />
            <div className="contador">{sobreMi.length}/150</div>
            {errors.sobreMi && <span>{errors.sobreMi.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="respuesta">Respuesta:</label>
            <input
              id="respuesta"
              type="text"
              placeholder='Ej: Resident Evil 3 de 1998'
              {...register('respuesta', respuestaValidation)}
            />
            <div className="contador">{respuesta.length}/60</div>
            {errors.respuesta && <span>{errors.respuesta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="picture">Imagen:</label>
            <input type="file" id="picture" />
          </div>
        </div>

        <div className="botones">
          <button type="submit">Enviar</button>
          <button type="button">Volver</button>
        </div>
      </form>

      <img
        src="/adaForm.jpg"
        alt="Derecha"
        className="side-image right"
      />
    </div>
  )
}

export default UserForm
