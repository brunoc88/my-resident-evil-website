import { NavLink } from "react-router-dom"

const NavBar = () => {
    return(
        <nav>
            <ul>
                <div>
                    <li>
                        <NavLink to=''>
                            Umbrella S.A
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
                </div>
                <div>
                    <li>
                        <NavLink to=''>
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