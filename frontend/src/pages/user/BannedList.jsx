import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { bannedList, reactivateAccount } from "../../services/user"
import { useAuth } from "../../context/AuthContext"
import './List.css'


const BannedList = () => {
    const { setNotification } = useOutletContext()
    const [bannedUsers, setBannedUsers] = useState(null)
    const [filter, setFilter] = useState(null)
    const [loading, setLoading] = useState(true) // <-- para evitar el parpadeo y esperar que se renderice el effect
    const { user, navigate } = useAuth()


    useEffect(() => {
        const loadBannedList = async () => {
            try {
                const res = await bannedList()
                if (res) {
                    setBannedUsers(res)
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }
        if (!bannedUsers) loadBannedList()
    }, [])




    const handleFilter = (e) => {
        let value = e.target.value
        if (!value) setFilter('')
        const usersFilter = bannedUsers.filter(user => user.userName.includes(value.trim().toLowerCase()))
        setFilter(usersFilter)
    }

    const handleReActivarCuenta = async (id) => {
        try {
            const res = await reactivateAccount(id)
            if (res) {
                setNotification({ error: '', exito: res.msj || 'Cuenta activada!' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
                const update = bannedUsers.filter(user => String(user.id).trim() !== String(id).trim())
                setBannedUsers(update)
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    let filterList = filter ? filter : bannedUsers

    if (user.rol !== 'admin') {
        navigate('/login')
    } else if (loading) {
        return <p>Cargando...</p>
    } else {
        return (
            <div className="list-container">
                <h1>Lista de Baneados</h1>

                {bannedUsers && bannedUsers.length === 0 ? (
                    <h2>No hay cuentas baneadas</h2>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Ingrese un usuario..."
                            onChange={handleFilter}
                            className="filter-input"
                        />

                        <ul className="user-list">
                            {filterList && filterList.map(b => (
                                <li key={b.id || b.userName}>
                                    <div className="user-info">
                                        <img src={`http://localhost:3000/uploads/${b.picture}`} alt="profile" />
                                        <span className="user-name">
                                            {b.userName}
                                        </span>
                                    </div>
                                    <button onClick={() => { handleReActivarCuenta(b.id) }}>Activar</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )
    }
}


export default BannedList