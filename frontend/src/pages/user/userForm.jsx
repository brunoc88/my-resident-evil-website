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
import { userPost, userAdminPost, myProfile, userEdit } from '../../services/user'
import { useOutletContext } from 'react-router-dom'
import login from '../../services/login'
import { useEffect } from 'react'
import './UserForm.css'
import { useAuth } from '../../context/AuthContext'
import { applyToken } from '../../services/token'

const UserForm = ({ isAdmin }) => {
  const { setToken, setUser, isAuth, navigate } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const sobreMi = watch('sobreMi', '')
  const respuesta = watch('respuesta', '')
  const userName = watch('userName', '')

  const { setNotification } = useOutletContext()


  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await myProfile()
        if (res?.user) {
          reset({
            id: res.user.id || '',
            userName: res.user.userName || '',
            email: res.user.email || '',
            sobreMi: res.user.sobreMi || '',
            respuesta: res.user.respuesta || '',
            pregunta: res.user.pregunta || '',
            picture: res.user.picture || ''
          })
          console.log('User', res.user)
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error)
      }
    }

    if (isAuth) cargarPerfil()
  }, [isAuth, reset])

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('userName', data.userName)
    formData.append('password', data.password)
    formData.append('password2', data.password2)
    formData.append('email', data.email)
    formData.append('pregunta', data.pregunta)
    formData.append('respuesta', data.respuesta)
    formData.append('sobreMi', data.sobreMi)
    if (data.picture && data.picture[0]) {
      formData.append('picture', data.picture[0])
    }
    if (isAdmin) {
      formData.append('secreto', data.secreto)
    }

    try {
      const res = isAdmin
        ? await userAdminPost(formData)
        : await userPost(formData)

      if (res && !res.error) {
        setNotification({ error: '', exito: 'Gracias por registrarte!' })
        setTimeout(() => setNotification({ error: '', exito: '' }), 5000)

        const loginRes = await login({
          user: data.userName,
          password: data.password
        })

        if (loginRes && loginRes.msj) {
          setToken(loginRes.token)
          setUser(loginRes.user)
         
          localStorage.setItem(
            'loggerReAppUser',
            JSON.stringify({ token: loginRes.token, user: loginRes.user })
          )
          applyToken(loginRes.token)
          navigate('/personajes/index')
        }

      }
    } catch (error) {
      setNotification({ error: error.message || 'Palabra secreta incorrecta!', exito: '' })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    }
  }

  const onVolver = (e) => {
    e.preventDefault() // <-- evita que el form se mande
    if (isAuth) {
      navigate(`user/miPerfil`)
    } else {
      navigate('/login')
    }
  }

  const handleEditar = async (data) => {
    try {
      const formData = new FormData()
      formData.append('userName', data.userName)
      if (data.password) {
        formData.append('password', data.password)
      }
      formData.append('email', data.email)
      formData.append('pregunta', data.pregunta)
      formData.append('respuesta', data.respuesta)
      formData.append('sobreMi', data.sobreMi)
      if (data.picture && data.picture[0]) {
        formData.append('picture', data.picture[0])
      }

      const res = await userEdit(data.id, formData)
      if (res && res.msj) {
        setNotification({ error: '', exito: res.msj })
        setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
      }
      navigate('/user/miPerfil')
    } catch (error) {
      setNotification({ error: error.message, exito: '' })
      setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
    }
  }
  return (
    <div className="user-form-layout">
      {!isAuth && (
        <img src="/leonForm.jpg" alt="Izquierda" className="side-image left" />
      )}

      <form onSubmit={handleSubmit(isAuth ? handleEditar : onSubmit)} className="formulario" encType="multipart/form-data">
        <h1>{isAuth ? 'Formulario de edición de Usuario' : 'Formulario de Usuario'}</h1>
        {!isAuth && <p>¿Te unes a la R.P.D o a Umbrella?</p>}

        <div className="grid">
          <div className="campo">
            <label htmlFor="userName">Nombre de Usuario:</label>
            <input
              id="userName"
              type="text"
              placeholder="Ej: adawong88"
              {...register('userName', userNameValidation)}
            />
            <div className="contador">{userName.length}/10</div>
            {errors.userName && <span>{errors.userName.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese un password"
              {...register('password', passwordValidation(isAuth))}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password2">Confirmar Password:</label>
            <input
              id="password2"
              type="password"
              {...register('password2', password2Validation(watch, isAuth))}
            />
            {errors.password2 && <span>{errors.password2.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="text"
              placeholder="Ej: capcom@gmail.com"
              {...register('email', emailValidation)}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pregunta">Selecciona una Pregunta:</label>
            <select id="pregunta" {...register('pregunta', preguntaValidation)}>
              <option value="">-- Elige una opción --</option>
              <option value="RE Favorito?">RE Favorito?</option>
              <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
              <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
            </select>
            {errors.pregunta && <span>{errors.pregunta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="respuesta">Respuesta:</label>
            <input
              id="respuesta"
              type="text"
              placeholder="Ej: Resident Evil 3 de 1998"
              {...register('respuesta', respuestaValidation)}
            />
            <div className="contador">{respuesta.length}/60</div>
            {errors.respuesta && <span>{errors.respuesta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="sobreMi">Escribe un poco sobre ti:</label>
            <textarea
              id="sobreMi"
              placeholder="Ej: Amo jugar Resident Evil..."
              {...register('sobreMi', sobreMiValidation)}
            />
            <div className="contador">{sobreMi.length}/150</div>
            {errors.sobreMi && <span>{errors.sobreMi.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="picture">Imagen:</label>
            <input type="file" id="picture" accept="image/*" {...register('picture')} />
          </div>

          {isAdmin && (
            <div className="campo">
              <label htmlFor="secreto">Palabra Secreta (Solo admins):</label>
              <input
                id="secreto"
                type="password"
                placeholder="Ingrese palabra secreta para admin"
                {...register('secreto', { required: 'Ingrese palabra secreta!' })}
              />
              {errors.secreto && <span>{errors.secreto.message}</span>}
            </div>
          )}
        </div>

        <div className="buttonGroup">
          <button type="submit">Enviar</button>
          <button onClick={onVolver}>Volver</button>
        </div>
      </form>

      {isAuth && (
        <img src="/adaForm.jpg" alt="Derecha" className="side-image right" />
      )}
    </div>
  )
}

export default UserForm
