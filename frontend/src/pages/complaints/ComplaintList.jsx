import { useEffect, useState } from "react"
import { getComplaits, deleteComplaint } from "../../services/complaints"
import { useAuth } from "../../context/AuthContext"
import { useOutletContext } from "react-router-dom"
import './ComplaintList.css'

const ComplaintList = () => {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const { setNotification } = useOutletContext()
    const { user, navigate } = useAuth()
    const isAdmin = user?.rol === 'admin'

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login')
            return
        }
        const loadComplaints = async () => {
            try {
                const res = await getComplaits()
                if (res && res.denuncias) setComplaints(res.denuncias)
            } catch (error) {
                setNotification({ error: error.message || `Hubo un error: ${error}` })
                setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
            } finally {
                setLoading(false)
            }
        }
        loadComplaints()
    }, [isAdmin, navigate, setNotification])


    const handleView = (id) => {
        navigate(`/denuncias/info/${id}`)
    }

    const handleDelete = async (id) => {
        let msj = 'Esta seguro que quiere eliminar esta denuncia?'
        if (confirm(msj)) {
            try {
                const res = await deleteComplaint(id)
                if (res) {
                    setComplaints(complaints.filter(c => c._id !== id))
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un error: ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }

        } else {
            return
        }
    }

    if (loading) return <p>Cargando...</p>

    return (
        <div className="complaint-list">
            <h1>Listado de denuncias:</h1>
            <table className="tabla-denuncias">
                <thead>
                    <tr>
                        <th>De:</th>
                        <th>Motivo:</th>
                        <th>Fecha:</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(c => (
                        <tr key={c._id}>
                            <td>{c.denunciante.userName}</td>
                            <td>{c.motivo}</td>
                            <td>{new Date(c.fecha).toLocaleString()}</td>
                            <td className="botones-cell">
                                <div className="botones">
                                    <button type="button" onClick={() => handleView(c._id)}>Ver</button>
                                    <button type="button" className="eliminar" onClick={() => handleDelete(c._id)}>Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ComplaintList
