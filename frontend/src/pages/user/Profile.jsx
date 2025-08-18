import { useEffect, useState } from "react"
import { useAuth } from '../../context/AuthContext'
import { useOutletContext, useParams, Link } from "react-router-dom"
import { myProfile, userProfile, follow, unFollow, deleteAccount, block, unBlock } from '../../services/user.js'
import styles from './Profile.module.css'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [seguidores, setSeguidores] = useState(null)
  const [seguidos, setSeguidos] = useState(null)
  const [loSigo, setLoSigo] = useState(null)
  const [isBlock, setIsBlock] = useState(null)
  const [imBlock, setImBlock] = useState(null)
  const { setNotification } = useOutletContext()
  const { user, setUser, navigate, handleLogout } = useAuth()
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
            if (user.bloqueos.includes(res.user.id)) {
              setIsBlock(true)
            } else {
              setIsBlock(false)
            }

            if (res.user.bloqueos.includes(user.id)) {
              setImBlock(true)
            } else {
              setImBlock(false)
            }

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
          setSeguidores(prev => prev + 1)
          setLoSigo(true)
          setUser({ // <-- persintencia
            ...user,
            seguidos: [...user.seguidos, id]
          })
        }


      } else {
        const res = await unFollow(id)
        if (res && res.msj) {
          setSeguidores(prev => prev - 1)
          setLoSigo(false)
          setUser({// <-- persintencia
            ...user,
            seguidos: user.seguidos.filter(uid => uid !== id)
          })
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
        } else {
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

  const handleBlockUser = async () => {
    try {
      if (isBlock) {
        let msj = `Deseas desbloquar a ${profile.userName}?`
        if (confirm(msj)) {
          const res = await unBlock(profile.id)
          if (res && res.msj) {
            setNotification({ error: '', exito: res.msj })
            setTimeout(() => {
              setNotification({ error: '', exito: '' })
            }, 5000)
            setIsBlock(false)
            setUser({ ...user, bloqueos: user.bloqueos.filter(u => u.id !== profile.id) })// <-- persintencia
          }
        }
      } else {
        let msj = `Desear bloquear a ${profile.userName}?`
        if (confirm(msj)) {
          const res = await block(profile.id)
          if (res && res.msj) {
            setNotification({ error: '', exito: res.msj })
            setTimeout(() => {
              setNotification({ error: '', exito: '' })
            }, 5000)
            setIsBlock(true)
            setUser({ ...user, bloqueos: [user.bloqueos, profile.id] }) // <-- persintencia
          }
        } else {
          return
        }
      }

    } catch (error) {
      setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
      setTimeout(() => {
        setNotification({ error: '', exito: '' })
      }, 5000)
    }
  }



  if (loading) return <p>Cargando...</p>

  if (!profile) {
    return <h1>La cuenta que intentas ver a sido eliminada o suspendida</h1>
  } else {
    return (
      <div className={styles.userProfileContainer}>
        <div className={styles.userHeader}>
          <h1>{profile.userName}</h1>
          {(user.userName !== profile.userName) && (!isBlock && !imBlock) && (
            loSigo
              ? <button className={styles.followButton} onClick={() => handleFollow(profile.id)}>Dejar de Seguir</button>
              : <button className={styles.followButton} onClick={() => handleFollow(profile.id)}>Seguir</button>
          )}
        </div>

        <div className={styles.userProfileContent}>
          {/* FOTO Y ESTADÍSTICAS */}
          <div className={styles.userImageBox}>
            <img
              src={`http://localhost:3000/uploads/${profile.picture}`}
              alt={`profile${profile.nombre}`}
              className={styles.userProfileImg}
            />
            {userName && userName !== user.userName ? <div className={styles.userStatsBox}>
              Seguidores: {seguidores} &nbsp; Seguidos: {seguidos}
            </div> :
              <div className={styles.userStatsBox}>
                <Link to='/user/followList'> Seguidores: {seguidores} &nbsp; Seguidos: {seguidos}</Link>
              </div>
            }
          </div>

          {/* DATOS */}
          <div className={styles.userInfoBox}>
            <p><strong>Usuario:</strong> {profile.userName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.rol === 'admin' && <p><strong>Puesto:</strong> Moderador/a</p>}
            <p><strong>Sobre Mi:</strong><br />{profile.sobreMi}</p>
            <p><strong>Usuario desde:</strong> {new Date(profile.fechaCreacion).toLocaleDateString('es-AR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</p>

            <div className={styles.userButtons}>
              {user.userName === profile.userName ?
                <>
                  <button className={styles.action} onClick={handleGoToEditProfile}>Editar</button>
                </> :
                <>
                  {!isBlock && !imBlock && <Link to={`/user/mensajes/${profile.id}`} className={styles.action}>Mandar Mensaje</Link>}
                  <Link className={styles.action} to={`/denuncias/crear/usuario/${profile.userName}/${profile.id}`}>Denunciar</Link>

                  {(user.rol !== 'admin' && profile.rol === 'admin') || (imBlock) ?
                    <></> :
                    <button className={styles.action} onClick={handleBlockUser}>{isBlock ? 'Desbloquear' : 'Bloquear'}</button>}
                </>
              }
              {(user?.userName === profile?.userName) ||
                (user?.rol === 'admin' && profile?.rol !== 'admin')
                ? <button className={styles.action} onClick={handleDeleteAccount}>Eliminar</button>
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Profile
