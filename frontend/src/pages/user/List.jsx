import { useEffect, useState } from "react"
import { useOutletContext, Link } from "react-router-dom"
import { blockList, unBlock } from "../../services/user"
import { useAuth } from "../../context/AuthContext"
import './List.css'


const List = ({ block }) => {
    const { setNotification } = useOutletContext()
    const [blockUsers, setBlockUsers] = useState(null)
    const [filter, setFilter] = useState(null)
    //const { user } = useAuth()

    useEffect(() => {
        const loadBlockList = async () => {
            try {
                const res = await blockList()
                if (res && res.bloqueados) {
                    setBlockUsers(res.bloqueados)
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (block) loadBlockList()
    }, [block])


    const handleUnblock = async (id) => {
        try {
            const res = await unBlock(id)
            if (res) {
                setBlockUsers(u => u.filter(user => user.id !== id))
            }
        } catch (error) {
            setNotification({ error: error.message || `hubo un problema: ${error}`, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

    const handleFilter = (e) => {
        let value = e.target.value
        if (!value) setFilter('')
        const usersFilter = blockUsers.filter(user => user.userName.includes(value.trim().toLowerCase()))
        setFilter(usersFilter)
    }

    let filterList = filter ? filter : blockUsers

    return (
        <div className="list-container">
            {block && <h1>Lista de Bloqueados</h1>}

            {blockUsers && blockUsers.length === 0 ? (
                <h2>No tienes bloqueados</h2>
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
                                    <Link to={`/user/perfil/${b.userName}`} className="user-name">
                                        {b.userName}
                                    </Link>
                                </div>
                                <button onClick={() => handleUnblock(b.id)}>Desbloquear</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}


export default List