const Notificaciones = ({ msj, error }) => {
  if (msj) return <p>{msj}</p>

  if (Array.isArray(error)) {
    return <ErrorList errores={error} />
  }

  if (error) {
    return <p>{error}</p>
  }

  return null
}


const ErrorList = ({ errores }) => {
  return (
    <ul>
      {errores.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  )
}


export default Notificaciones