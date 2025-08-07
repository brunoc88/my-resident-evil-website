import { useEffect, useState } from "react"
import { myFollowed, myFollowers } from "../../services/user"
import { useOutletContext, Link } from "react-router-dom"
import './List.css'

const FollowList = () => {
  const { setNotification } = useOutletContext()
  const [seguidos, setSeguidos] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [verFollowed, setVerFollowed] = useState(true)
  const [filterValue, setFilterValue] = useState("")
  

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
              <button>Escribir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FollowList
