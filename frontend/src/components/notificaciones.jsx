import './Notificaciones.css'

const Notificaciones = ({ msj, error }) => {
  if (msj) return <p className="noti success">{msj}</p>

  if (Array.isArray(error)) {
    return <ErrorList errores={error} />
  }

  if (error) {
    return <p className="noti error">{error}</p>
  }

  return null
}


const ErrorList = ({ errores }) => {
  return (
    <ul className="noti error-list">
      {errores.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  )
}


export default Notificaciones