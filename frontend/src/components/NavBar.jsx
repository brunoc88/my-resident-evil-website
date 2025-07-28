import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import './NavBar.css'

const NavBar = () => {
    const { isAuth, user, handleLogout } = useAuth()
    return (
        <nav>
            <ul>
                <div>
                    <li>
                        <NavLink to=''>
                            Umbrella S.A
                            <img src="/logo.png" alt="logo" />
                        </NavLink>
                    </li>
                </div>
                <div>
                    <li>
                        <NavLink to='personajes/index'>
                            Personajes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='nosotros'>
                            Nosotros
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='contactos'>
                            Contactanos
                        </NavLink>
                    </li>
                </div>
                <div>
                    {isAuth === false &&
                        <li>
                            <NavLink to='login'>
                                Login
                            </NavLink>
                        </li>
                    }
                    {isAuth === false &&
                        <li>
                            <NavLink to='registro'>
                                Registrarse
                            </NavLink>
                        </li>
                    }
                    {isAuth &&
                        <li>
                            <NavLink to=''>
                                {user.userName}
                            </NavLink>
                        </li>
                    }
                    {isAuth &&
                        <li>
                            <button onClick={handleLogout} className="logout-link">Logout</button>
                        </li>
                    }
                </div>
            </ul>
        </nav>
    )
}

export default NavBar