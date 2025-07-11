import { useState } from "react"
import { Outlet } from "react-router-dom"
import Notificaciones from '../components/Notificaciones'

const LayOut = () => {
  const [error, setError] = useState(null)
  const [msj, setMsj] = useState(null)

  return (
    <>
      <Notificaciones error={error} msj={msj} />
      <Outlet context={{ setError, setMsj }} />
    </>
  )
}

export default LayOut
