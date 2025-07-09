const Notificaciones = ({ msj, error }) => {
  if (msj) return <p>{msj}</p>

  if (error) return <p>{error}</p>
  if (error && Array.isArray(error)) {
    return <ErrorList errores={error} />
  }
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