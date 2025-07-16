import { useForm } from 'react-hook-form'
import './UserForm.css'

const UserForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const sobreMi = watch('sobreMi', '')

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
            <label htmlFor="userName">Nombre:</label>
            <input
              id="userName"
              {...register('userName', { required: 'Nombre requerido' })}
              placeholder="Ej: adaWong"
            />
            {errors.userName && <span>{errors.userName.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Contraseña requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              {...register('email', {
                required: 'Email requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido'
                }
              })}
              placeholder="Ej: capcom@gmail.com"
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password2">Confirmar Password:</label>
            <input
              type="password"
              id="password2"
              {...register('password2', {
                required: 'Debes confirmar la contraseña',
                validate: value =>
                  value === watch('password') || 'Las contraseñas no coinciden'
              })}
            />
            {errors.password2 && <span>{errors.password2.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pregunta">Selecciona una Pregunta:</label>
            <select
              id="pregunta"
              {...register('pregunta', { required: 'Selecciona una pregunta' })}
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
              {...register('sobreMi', {
                maxLength: {
                  value: 60,
                  message: 'Máximo 60 caracteres'
                }
              })}
            />
            <div className="contador">{sobreMi.length}/60</div>
            {errors.sobreMi && <span>{errors.sobreMi.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="respuesta">Respuesta:</label>
            <input
              id="respuesta"
              {...register('respuesta', { required: 'Respuesta requerida' })}
            />
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
