import { useEffect, useState } from "react"
import { follow, myFollowed, myFollowers, unFollow } from "../../services/user"
import { useOutletContext, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './List.css'


const FollowList = () => {
  const { setNotification } = useOutletContext()
  const [seguidos, setSeguidos] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [verFollowed, setVerFollowed] = useState(true)
  const [filterValue, setFilterValue] = useState("")
  const { user, setUser } = useAuth()
  let yo = user // <-- cambio el nombre para no haya confucion en la comparacion


  useEffect(() => {
    if (verFollowed && seguidos.length === 0) {
      const loadFollowed = async () => {
        try {
          const res = await myFollowed()
          setSeguidos(res.seguidos)
        } catch (error) {
          setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
          setTimeout(() => {
            setNotification({ error: '', exito: '' })
          }, 5000)
        }
      }
      loadFollowed()
    }
  }, [verFollowed])

  useEffect(() => {
    if (!verFollowed && seguidores.length === 0) {
      const loadFollowers = async () => {
        try {
          const res = await myFollowers()
          setSeguidores(res.seguidores)
        } catch (error) {
          setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
          setTimeout(() => {
            setNotification({ error: '', exito: '' })
          }, 5000)
        }
      }
      loadFollowers()
    }
  }, [verFollowed])


  const handleAction = async (id) => {
    try {
      let res = ''

      if (yo.seguidos.includes(id)) {
        res = await unFollow(id)

        if (res) {
          // actualizar user en contexto
          setUser({
            ...user,
            seguidos: user.seguidos.filter(uid => uid !== id)
          })
        }

      } else {
        res = await follow(id)

        if (res) {
          // actualizar user en contexto
          setUser({
            ...user,
            seguidos: [...user.seguidos, id]
          })
        }
      }

      // refrescar la lista local de seguidos
      if (res) {
        const nuevosSeguidos = await myFollowed()
        setSeguidos(nuevosSeguidos.seguidos)
      }

      if (res && res.msj) {
        setNotification({ error: '', exito: res.msj })
        setTimeout(() => {
          setNotification({ error: '', exito: '' })
        }, 5000)
      }

    } catch (error) {
      setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
      setTimeout(() => {
        setNotification({ error: '', exito: '' })
      }, 5000)
    }
  }


  const handleFilter = (e) => {
    setFilterValue(e.target.value.toLowerCase())
  }

  const filteredList = (verFollowed ? seguidos : seguidores).filter(user =>
    user.userName.toLowerCase().includes(filterValue)
  )

  return (
    <div className="list-container">
      <input
        type="text"
        placeholder="Ingrese el nombre de usuario"
        onChange={handleFilter}
        value={filterValue}
        className="filter-input"
      />

      <div className="tabs">
        <button
          className={verFollowed ? "tab active" : "tab"}
          onClick={() => {
            setVerFollowed(true)
            setFilterValue("")
          }}
        >
          Seguidos
        </button>
        <button
          className={!verFollowed ? "tab active" : "tab"}
          onClick={() => {
            setVerFollowed(false)
            setFilterValue("")
          }}
        >
          Seguidores
        </button>
      </div>

      {filteredList.length === 0 ? (
        <h2>{verFollowed ? "No sigues a nadie." : "No tienes seguidores."}</h2>
      ) : (
        <ul className="user-list">
          {filteredList.map(user => (
            <li key={user.id}>
              <div className="user-info">
                <img
                  src={`http://localhost:3000/uploads/${user.picture}`}
                  alt="profile"
                />
                <Link to={`/user/perfil/${user.userName}`} className="user-name">
                  {user.userName}
                </Link>
              </div>
              {yo.seguidos.includes(user.id)
                ? <button onClick={() => handleAction(user.id)}>Dejar de seguir</button>
                : <button onClick={() => handleAction(user.id)}>Seguir</button>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FollowList
