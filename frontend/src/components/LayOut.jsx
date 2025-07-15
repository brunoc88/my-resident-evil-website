import NavBar from "./NavBar"
import { Outlet } from "react-router-dom"


const LayOut = () => {
    return (
        <>
            <NavBar/>
            <Outlet/>
        </>
    )
}

export default LayOut