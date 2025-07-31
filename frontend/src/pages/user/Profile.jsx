import { useEffect, useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useOutletContext } from "react-router-dom"
import { myProfile } from '../../services/user.js'
import './Profile.css'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seguidores, setSeguidores] = useState(1000)
  const [seguidos, setSeguidos] = useState(400)
  const { setNotification } = useOutletContext()
  const { isAuth, user } = useAuth()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await myProfile()
        if (res && res.user) {
          setProfile(res.user)
        }
      } catch (error) {
        setNotification({ error: error.message || `Hubo un problema: ${error}` })
        setTimeout(() => {
          setNotification({ error: '', exito: '' })
        }, 5000)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <div className="user-profile-container">
      <div className="user-header">
        <h1>{profile.userName}</h1>
        <button className="follow-button">Seguir</button>
      </div>

      <div className="user-profile-content">
        {/* FOTO Y ESTADÍSTICAS */}
        <div className="user-image-box">
          <img
            src={`http://localhost:3000/uploads/${profile.picture}`}
            alt={`profile${profile.nombre}`}
            className="user-profile-img"
          />
          <div className="user-stats-box">
            Seguidores: {seguidores} &nbsp; Seguidos: {seguidos}
          </div>
        </div>

        {/* DATOS */}
        <div className="user-info-box">
          <p><strong>Usuario:</strong> {profile.userName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.rol === 'admin' && <p><strong>Puesto:</strong> Moderador/a</p>}
          <p><strong>Sobre Mi:</strong><br />{profile.sobreMi}</p>
          <p><strong>Usuario desde:</strong> {new Date(profile.fechaCreacion).toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>

          <div className="user-buttons">
            <button className="action">Mandar Mensaje</button>
            <button className="action">Denunciar</button>
            {user?.rol === 'admin' && <button className="action delete">Eliminar</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
