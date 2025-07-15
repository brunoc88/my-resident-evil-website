import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {validarPassword} from "../utils/validarLogin"
import login from "../services/login"

const Login = () => {

    const [usuario, setUsuario] = useState({user:'', password:''})
    const [validationError, setValidationError] = useState('')
    

    const handleChange = (e) => {
        setValidationError(null)
        const {name, value} = e.target
        setUsuario(prev => ({...prev, [name]: value}))
        // Validación solo si cambia el password
        if (name === 'password') {
            const validation = validarPassword(value)
            setValidationError(validation.password)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
    }

    return (
        <div>
            <div>
                <div>
                    {}
                </div>
                <div>
                    <p>Iniciar sesión </p>
                </div>
                <div>
                    <form onSubmit={handleSubmit} method="post">
                        <label htmlFor="user">Usuario:</label>
                        <div>
                            <input type="text"
                                placeholder="Ingrese usuario/Email"
                                id="user" name="user"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <label htmlFor="password">Password:</label>
                        <div>
                            <input type="password"
                                placeholder="Ingrese un password"
                                id="password" name="password"
                                onChange={handleChange}
                                required
                            />
                            {validationError && <div style={{ color: 'red' }}>{validationError}</div>}
                        </div>
                        <div>
                            <button type="submit">Login</button>
                            <button>Registrarse</button>
                        </div>
                    </form>
                </div>
                <div>
                    <p><a href="http://">Olvidaste tu password?</a></p>
                </div>
            </div>
        </div>
    )
}

export default Login