import NavBar from "./NavBar"
import Notification from "./Notification"
import { Outlet} from "react-router-dom"
import { useState } from "react"


const LayOut = () => {
    const [notification, setNotification] = useState({ error: '', exito: '' })
    return (
        <>
            <NavBar />
            <main>
                {/*es un atajo para pasar las props individualmente, es decir: */}
                {/*<Notification error={notification.error} exito={notification.exito} /> */}
                <Notification {...notification} /> 
                <Outlet context={{ setNotification }} />
            </main>
        </>
    )
}

export default LayOut