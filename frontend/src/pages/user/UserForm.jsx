import { useState } from "react"
import { useNavigate, useOutletContext } from 'react-router-dom'
import UserInputField from "../../components/userInputField"
import { validateField } from '../../utils/userValidation'
import { userPost } from '../../services/user/userServices'
import './UserForm.css'

const UserForm = () => {
  const [user, setUser] = useState({
    userName: '',
    email: '',
    pregunta: '',
    respuesta: '',
    sobreMi: '',
    picture: '',
    password: '',
    password2: ''
  })

  const [validation, setValidation] = useState({
    userName: null,
    email: null,
    password: null,
    password2: null,
    respuesta: null,
    sobreMi: null
  })

  const [frontNotification, setFrontNoticiation] = useState({
    userName: '',
    email: '',
    password: '',
    password2: '',
    respuesta: '',
    sobreMi: ''
  })

  const { setError, setMsj } = useOutletContext()
  const navigate = useNavigate()

  const checkFieldValidation = (field, value) => {
    const { valid, errorMsj } = validateField(field, value, user)

    // Seteamos false en los campos 
    setValidation(prev => ({
      ...prev,
      [field]: valid
    }))

    // Seteamos los mensajes 
    setFrontNoticiation(prev => ({
      ...prev,
      [field]: errorMsj
    }))
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    const updatedValue = name === 'picture' ? files[0] : value

    const updatedUser = {
      ...user,
      [name]: updatedValue
    }

    setUser(updatedUser)
    checkFieldValidation(name, updatedValue)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('userName', user.userName)
    formData.append('email', user.email)
    formData.append('pregunta', user.pregunta)
    formData.append('respuesta', user.respuesta)
    formData.append('sobreMi', user.sobreMi)
    formData.append('picture', user.picture)
    formData.append('password', user.password)

    const hasErrors = Object.values(validation).some(v => v === false)

    if (hasErrors) {
      const confirmSend = window.confirm('Se encontraron errores en el formulario. ¿Desea enviarlo de todas formas?')
      if (!confirmSend) return
    }

    try {
      const data = await userPost(formData)

      if (data.msj) {
        setMsj(prev => [...prev, data.msj])
        navigate('/home')
      }
      if(data.error){
        setError(data.error)
        setUser(data.error.data)
      }
    } catch (error) {
      console.log(error.error || error.message || 'Error desconocido')
    }
  }

  return (
    <div>
      <h1>Inscripción para ser un miembro de la R.P.D o Umbrella!</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <UserInputField
          label="Nombre de usuario:"
          name="userName"
          value={user.userName}
          onChange={handleChange}
          isValid={validation.userName}
          message={frontNotification.userName}
          placeholder="Ingresar nombre de usuario"
        />

        <UserInputField
          label="Email:"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          isValid={validation.email}
          message={frontNotification.email}
          placeholder="Ingrese un Email"
        />

        <div>
          <label htmlFor="pregunta">Selecciona una pregunta:</label>
          <select name="pregunta" id="pregunta" value={user.pregunta} onChange={handleChange}>
            <option value="">--</option>
            <option value="Resident Evil Favorito?">Resident Evil Favorito?</option>
            <option value="Personaje Favorito?">Personaje Favorito?</option>
            <option value="Como descubriste Resident Evil?">¿Cómo descubriste Resident Evil?</option>
          </select>
        </div>

        <UserInputField
          label="Respuesta:"
          name="respuesta"
          value={user.respuesta}
          onChange={handleChange}
          isValid={validation.respuesta}
          message={frontNotification.respuesta}
          placeholder="Ingrese una respuesta"
        />
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#ccc' }}>
          {user.respuesta.length}/60 caracteres
        </div>

        <div>
          <label htmlFor="sobreMi">Sobre mí:</label>
          <textarea
            name="sobreMi"
            id="sobreMi"
            value={user.sobreMi}
            placeholder="Cuéntanos sobre ti (opcional)"
            onChange={handleChange}
          />
          <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#ccc' }}>
            {user.sobreMi.length}/150 caracteres
          </div>
          {validation.sobreMi === false && <span>{frontNotification.sobreMi} ❌</span>}
        </div>

        <div>
          <label htmlFor="picture">Foto: (opcional)</label>
          <input type="file" name="picture" id="picture" onChange={handleChange} />
        </div>

        <UserInputField
          label="Password:"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          isValid={validation.password}
          message={frontNotification.password}
          placeholder="Ingrese una password"
        />

        <UserInputField
          label="Repite el password:"
          name="password2"
          type="password"
          value={user.password2}
          onChange={handleChange}
          isValid={validation.password2}
          message={frontNotification.password2}
          placeholder="Repite el password"
        />

        <div className="botones-container">
          <button id="registrarse" type="submit">Registrarse</button>
          <button id="volver" type="button" onClick={() => navigate(-1)}>Volver</button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
