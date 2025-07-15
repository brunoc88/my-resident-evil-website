import { NavLink } from "react-router-dom"
import './NavBar.css'

const NavBar = () => {
    return(
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
                            Mi Perfil
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
                    <li>
                        <NavLink to='login'>
                            Login
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to=''>
                            Registrarse
                        </NavLink>
                    </li>
                </div>
            </ul>
        </nav>
    )
}

export default NavBar