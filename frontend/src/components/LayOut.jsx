import NavBar from "./NavBar"
import { Outlet } from "react-router-dom"


const LayOut = ({ isAuth, user, onLogout }) => {
    return (
        <>
            <NavBar isAuth={isAuth} user={user} onLogout={onLogout} />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default LayOut