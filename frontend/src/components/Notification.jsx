
const Notification = ({ error, exito }) => {
  if (!error && !exito) return null

  return (
    <div>
      {exito ? <p style={{ color: 'green' }}>{exito}</p> : <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Notification
