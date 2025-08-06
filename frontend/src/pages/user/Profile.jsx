import { useEffect, useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useOutletContext, useParams, Link } from "react-router-dom"
import { myProfile, userProfile, follow, unFollow, deleteAccount } from '../../services/user.js'
import './Profile.css'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seguidores, setSeguidores] = useState(null)
  const [seguidos, setSeguidos] = useState(null)
  const [loSigo, setLoSigo] = useState(null)
  const { setNotification } = useOutletContext()
  const { user, navigate, handleLogout } = useAuth()
  const { userName } = useParams()

  useEffect(() => {
    setProfile('')
    const loadProfile = async () => {
      try {
        if (!userName) { // <-- si userName esta vacio es porque estoy viendo mi propio perfil
          const res = await myProfile()
          if (res && res.user) {
            setProfile(res.user)
            setSeguidos(res.user.seguidos.length)
            setSeguidores(res.user.seguidores.length)
          }
        } else {
          const res = await userProfile(userName)
          if (res && res.user) {
            setProfile(res.user)
            setSeguidos(res.user.seguidos.length)
            setSeguidores(res.user.seguidores.length)
            if (user.seguidos.includes(res.user.id)) {
              setLoSigo(true)
            } else {
              setLoSigo(false)
            }
          }
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
  }, [userName])


  const handleGoToEditProfile = () => {
    navigate('user/editar')
  }

  const handleFollow = async (id) => {
    try {
      if (!loSigo) {
        const res = await follow(id)
        if (res && res.msj) {
          setNotification({ error: '', exito: res.msj })
          setTimeout(() => {
            setNotification({ error: '', exito: '' })
          }, 5000)
          setSeguidores(prev => prev + 1)
          setLoSigo(true)
        }


      } else {
        const res = await unFollow(id)
        if (res && res.msj) {
          setNotification({ error: '', exito: res.msj })
          setTimeout(() => {
            setNotification({ error: '', exito: '' })
          }, 5000)
          setSeguidores(prev => prev - 1)
          setLoSigo(false)
        }
      }

    } catch (error) {
      setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
      setTimeout(() => {
        setNotification({ error: '', exito: '' })
      }, 5000)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      let res = ''
      let msj = 'Realmente desea eliminar la cuenta?'
      if (confirm(msj)) {
        if (userName && user.rol === 'admin') { // <-- pregunto si estoy viendo el perfil de un usuario y si mi rol es admin
          res = await deleteAccount(profile.id) // <-- si es asi paso el perfil de ese usuario
        } else{
          res = await deleteAccount(user.id) // <-- si es mi propio perfil paso mi id
        }
        if (res && !userName) {
          handleLogout() // <-- si elimine mi propia cuenta me desloguea y manda al login
        } else {
          navigate('/personajes/index') //<-- si elimine otra cuenta como admin me manda al index personajes
        }
      } else {
        return
      }
    } catch (error) {
      setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
      setTimeout(() => {
        setNotification({ error: '', exito: '' })
      }, 5000)
    }
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div className="user-profile-container">
      <div className="user-header">
        <h1>Perfil de {profile.userName}</h1>
        {user.userName !== profile.userName && (
          loSigo
            ? <button className="follow-button" onClick={() => handleFollow(profile.id)}>Dejar de Seguir</button>
            : <button className="follow-button" onClick={() => handleFollow(profile.id)}>Seguir</button>
        )}
      </div>

      <div className="user-profile-content">
        {/* FOTO Y ESTADÍSTICAS */}
        <div className="user-image-box">
          <img
            src={`http://localhost:3000/uploads/${profile.picture}`}
            alt={`profile${profile.nombre}`}
            className="user-profile-img"
          />
          {userName ? <div className="user-stats-box">
            Seguidores: {seguidores} &nbsp; Seguidos: {seguidos}
          </div> :
            <div className="user-stats-box">
              <Link to='/user/followList'> Seguidores: {seguidores} &nbsp; Seguidos: {seguidos}</Link>
            </div>
          }
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
            {user.userName === profile.userName ?
              <>
                <button className="action" onClick={handleGoToEditProfile}>Editar</button>
              </> :
              <>
                <button className="action">Mandar Mensaje</button>
                <button className="action">Denunciar</button>
                <button className="action">Bloquear</button>
              </>
            }
            {(user?.userName === profile?.userName) ||
              (user?.rol === 'admin' && profile?.rol !== 'admin')
              ? <button className="action" onClick={handleDeleteAccount}>Eliminar</button>
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
