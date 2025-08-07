import { useState, useEffect } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { getUsers } from "../../services/user"
import './List.css'


const Searching = () => {
    const [filter, SetFilter] = useState(null)
    const [users, setUsers] = useState(null)
    const { setNotification } = useOutletContext()

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await getUsers()
                if (res) {
                    setUsers(res)
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (!users) loadUsers()
    }, [])

    const handleFilter = (e) => {
        let value = e.target.value

        if (!value.trim()) {
            SetFilter(null)
            return
        }

        const searching = users.filter(user =>
            user.userName.toLowerCase().includes(value.trim().toLowerCase())
        )
        SetFilter(searching)
    }

    const result = filter ? filter : ''

    return (
        <div className="list-container">
            <div>
                <h1>Busqueda de Usuario</h1>
            </div>
            
                <input type="text"
                    placeholder="Ingrese un nombre de usuario..."
                    onChange={handleFilter}
                    className="filter-input"
                />
            
            <ul className="user-list">
                {result && result.length > 0 ? (
                    <>
                        {result.map(u => (
                            <li key={u.id}>
                                <div className="user-info">
                                    <img src={`http://localhost:3000/uploads/${u.picture}`} alt="profile" />
                                    <Link to={`/user/perfil/${u.userName}`} className="user-name">
                                        {u.userName}
                                    </Link>
                                </div>
                                
                            </li>
                        ))}
                    </>) : (<div></div>)
                }
            </ul>
        </div>
    )
}

export default Searching