import './Notification.css'

const Notification = ({ error, exito }) => {
  if (!error && !exito) return null

  return (
    <div>
      {exito ? <p className="succes-msg">{exito}</p> : <p className="error-msg">{error}</p>}
    </div>
  )
}

export default Notification
