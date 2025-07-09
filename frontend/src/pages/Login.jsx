import { useState } from "react"
import { useNavigate, useOutletContext } from 'react-router-dom'
import login from "../services/login"
import './Login.css'

const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { setError } = useOutletContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null) // limpiamos errores anteriores

        try {
            const res = await login({ user, password })

            if (res && res.error) {
                setError(res.error)
            } else {
                navigate('/home')
            }
        } catch (err) {
            setError(err.message || 'Error en el servidor')
        }
    }

    return (
        <>
            <div>
                <h2>Iniciar sesión</h2>
            </div>
            <form onSubmit={handleSubmit} method="post">
                <div>
                    <label htmlFor="user">Usuario:</label>
                    <input
                        type="text"
                        placeholder="Ingrese Email o nombre de usuario"
                        name="user"
                        id="user"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        placeholder="Ingrese password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="links-inline">
                <a href="">Registrarse</a>
                <span className="separator">|</span>
                <a href="">Olvidaste tu password?</a>
            </div>
        </>
    )
}

export default Login
