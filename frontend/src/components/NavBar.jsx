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
                    <li className="dropdown">
                        <NavLink to="personajes/index" className="dropbtn">
                            Personajes
                        </NavLink>
                        <div className="dropdown-content">
                            {isAuth &&
                                <NavLink to="personajes/registro">Registrar personaje</NavLink>
                            }
                        </div>
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
                        <li className="dropdown">
                            <NavLink to='user/miPerfil'>
                                {user.userName}
                            </NavLink>
                            <div className="dropdown-content">
                                <NavLink to="user/bloqueados">Lista de Bloqueados</NavLink>
                                {user.rol === 'admin' && <NavLink to="user/baneados">Lista de Baneados</NavLink>}
                                <NavLink to="user/buscar">Buscar Usuario</NavLink>
                            </div>
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