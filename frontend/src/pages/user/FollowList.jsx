import { useEffect, useState } from "react"
import { myFollowed, myFollowers } from "../../services/user"

const FollowList = () => {
  const [seguidos, setSeguidos] = useState([])
  const [seguidores, setSeguidores] = useState([])
  const [verFollowed, setVerFollowed] = useState(true)
  const [verFollowers, setVerFollowers] = useState(false)
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    if (verFollowed) {
      const loadFollowed = async () => {
        try {
          const res = await myFollowed()
          setSeguidos(res.seguidos)
        } catch (error) {
          console.log(error)
        }
      }
      loadFollowed()
    }
  }, [verFollowed])

  useEffect(() => {
    if (verFollowers) {
      const loadFollowers = async () => {
        try {
          const res = await myFollowers()
          setSeguidores(res.seguidores)
        } catch (error) {
          console.log(error)
        }
      }
      loadFollowers()
    }
  }, [verFollowers])

  const handleFilter = (e) => {
    setFilterValue(e.target.value.toLowerCase())
  }

  const filteredList = verFollowed
    ? seguidos.filter(s => s.userName.toLowerCase().includes(filterValue))
    : seguidores.filter(s => s.userName.toLowerCase().includes(filterValue))

  return (
    <div>
      <div>
        <button onClick={() => {
          setVerFollowed(true)
          setVerFollowers(false)
          setFilterValue("")
        }}>
          Seguidos
        </button>
        <button onClick={() => {
          setVerFollowers(true)
          setVerFollowed(false)
          setFilterValue("")
        }}>
          Seguidores
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Ingrese nombre de usuario..."
          onChange={handleFilter}
          value={filterValue}
        />
      </div>

      <div>
        {verFollowed && (
          <>
            {seguidos.length === 0 ? (
              <p>No sigues a nadie.</p>
            ) : (
              <>
                <p>Lista de seguidos:</p>
                <ul>
                  {filteredList.map(s => (
                    <li key={s.id}>{s.userName} <button>Escribir</button></li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        {verFollowers && (
          <>
            {seguidores.length === 0 ? (
              <p>No tienes seguidores.</p>
            ) : (
              <>
                <p>Lista de seguidores:</p>
                <ul>
                  {filteredList.map(s => (
                    <li key={s.id}>{s.userName} <button>Escribir</button></li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FollowList
