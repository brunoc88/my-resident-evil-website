import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validarPassword } from "../utils/validarLogin"
import login from "../services/login"
import './Login.css'

const Login = () => {
    const [usuario, setUsuario] = useState({ user: '', password: '' })
    const [validationError, setValidationError] = useState('')
    const [dbErrorMsj, setDbErrorMsj] = useState('')
    const navigate = useNavigate()

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
        setDbErrorMsj(null)
        const { user, password } = usuario
        const res = await login({ user, password })
        if (res && res.error) {
            setDbErrorMsj(res.error)
        } else {
            navigate('/home')
        }
    }

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

export default Login
