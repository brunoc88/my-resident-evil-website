import { useState } from "react"
import { Outlet } from "react-router-dom"
import Notificaciones from "../components/notificaciones"

const LayOut = () => {
  const [error, setError] = useState(null)
  const [msj, setMsj] = useState(null)

  return (
    <>
      <Outlet context={{ setError, setMsj }} />
      <Notificaciones error={error} msj={msj} />
    </>
  )
}

export default LayOut
