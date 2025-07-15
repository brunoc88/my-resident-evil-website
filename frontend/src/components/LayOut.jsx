import NavBar from "./NavBar"
import { Outlet } from "react-router-dom"
import './LayOut.css'
const LayOut = () => {
    return (
        <>
            <NavBar/>
            <Outlet/>
        </>
    )
}

export default LayOut