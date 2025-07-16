import { useState } from "react"
import { validarPassword } from "../utils/validarLogin"
import login from "../services/login"
import './Login.css'

const Login = ({ setToken, setUser, isAuth, user }) => {

    const [usuario, setUsuario] = useState({ user: '', password: '' })
    const [validationError, setValidationError] = useState('')
    const [dbErrorMsj, setDbErrorMsj] = useState('')

    const handleChange = (e) => {
        setValidationError(null)
        const { name, value } = e.target
        setUsuario(prev => ({ ...prev, [name]: value }))
        if (name === 'password') {
            const validation = validarPassword(value)
            setValidationError(validation.password)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validationError) {
            setValidationError('Ingresar un password valido!')
        } else {
            setDbErrorMsj(null)
            const { user, password } = usuario
            const res = await login({ user, password })
            if (res && res.error) {
                setDbErrorMsj(res.error)
            }
            if (res && res.token) {
                window.localStorage.setItem('loggerReAppUser', JSON.stringify(res))
                setToken(res.token)
                setUser(res.user)
            }
        }
    }

    if (!isAuth) {
        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="login-form-section">
                        {dbErrorMsj && <div className="error-msg">{dbErrorMsj}</div>}
                        <h2>Iniciar sesión</h2>
                        <form onSubmit={handleSubmit} method="post">
                            <label htmlFor="user">Usuario:</label>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Ingrese usuario/Email"
                                    id="user"
                                    name="user"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <label htmlFor="password">Password:</label>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Ingrese un password"
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    required
                                />
                                {validationError && <div style={{ color: 'red' }}>{validationError} ❌</div>}
                            </div>

                            <div>
                                <button type="submit">Login</button>
                                <button type="button">Registrarse</button>
                            </div>
                        </form>

                        <div className="recovery-link">
                            <p><a href="#">¿Olvidaste tu password?</a></p>
                        </div>
                    </div>

                    <div className="login-image-section">
                        <div className="login-text">
                            <p>
                                Jill mirando al vacío,<br />
                                recordando todo lo que vivió para sobrevivir...
                            </p>
                        </div>
                        <img src="/jill-login.jpg" alt="Jill Valentine" />
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <div>
                    <h1>Bienvenido de nuevo {user.userName}!</h1>
                </div>
                <div>
                    <p>
                        Recuerdas que puedes, crear, editar, likear y comentar personajes,
                        como tambien puedes mensajearte con otros usuarios!
                    </p>
                </div>
            </div>
        )
    }


}

export default Login
