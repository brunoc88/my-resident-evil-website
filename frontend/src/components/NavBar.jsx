import { NavLink } from "react-router-dom"
import './NavBar.css'

const NavBar = ({ isAuth, user, onLogout }) => {
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
                        <NavLink to=''>
                            Personajes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to=''>
                            Nosotros
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to=''>
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
                            <NavLink to=''>
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
                            <button onClick={onLogout} className="logout-link">Logout</button>
                        </li>}
                </div>
            </ul>
        </nav>
    )
}

export default NavBar