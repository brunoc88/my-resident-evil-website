import { useState } from "react"
import { useNavigate, useOutletContext } from 'react-router-dom'
import login from "../services/login"

const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { setError } = useOutletContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null) //// limpiámos errores anteriores
        console.log('USER:', user)
        console.log('PASSWORD', password)

        try {
            const res = await login({ user, password })

            if(res && res.error){
                setError(res.error)
            }else{
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
            <div>
                <form onSubmit={handleSubmit} method="post">
                    <div>
                        <div>
                            Usuario: <input type="text"
                                placeholder="Ingrese Email o nombre de usuario"
                                name="user" onChange={(e) => setUser(e.target.value)}
                                value={user}
                            />
                        </div>
                        <div>
                            Password: <input type="password"
                                placeholder="Ingrese password"
                                name="password" onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
            <div>
                <p><a href="">Registrarse</a></p>
            </div>
            <div>
                <p><a href="">Olvidaste tu password?</a></p>
            </div>
        </>
    )
}

export default Login