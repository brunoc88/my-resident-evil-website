import { useEffect, useState } from "react"
import { deleteComplaint, getComplaits } from "../../services/complaints"
import { useOutletContext, useParams, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import './ComplaintInfo.css'

const ComplaintInfo = () => {
    const [complaint, setComplaint] = useState(null)
    const [loading, setLoading] = useState(true)
    const { setNotification } = useOutletContext()
    const { user, navigate } = useAuth()
    const { id } = useParams()
    const isAdmin = user?.rol === 'admin'

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login')
            return
        }
        const loadComplaint = async () => {
            try {
                const res = await getComplaits()
                if (res && res.denuncias) {
                    let complaints = res.denuncias
                    setComplaint(complaints.find(c => c._id === id))
                }
            } catch (error) {
                setNotification({ error: error.message || `Hubo un error: ${error}` })
                setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
            } finally {
                setLoading(false)
            }
        }
        loadComplaint()
    }, [isAdmin, id, navigate, setNotification])

    if (loading) return <p>Cargando...</p>
    if (!complaint) return <p className="error">No se encontró la denuncia.</p>

    const handleBackTo = () => {
        navigate('/denuncias/lista')
    }

    const handleDelete = async (id) => {
        try {
            let msj = 'Esta seguro que quiere eliminar esta denuncia?'
            if (confirm(msj)) {
                const res = await deleteComplaint(id)
                if (res) handleBackTo()
            } else {
                return
            }
        } catch (error) {
            setNotification({ error: error.message || `Hubo un error: ${error}` })
            setTimeout(() => setNotification({ error: '', exito: '' }), 5000)
        }
    }

    return (
        <div className="complaint-container">
            <h1 className="title">
                Datos de la Denuncia
            </h1>
            <div className="complaint-detail">
                <strong>Denunciante:</strong> <span>{complaint.denunciante.userName}</span>
            </div>
            <div className="complaint-detail">
                <strong>Entidad:</strong> <span>{complaint.entidad.tipo && complaint.entidad.tipo === 'User'? 'Usuario': 'Personaje'}</span>
            </div>
            <div className="complaint-detail">
                <strong>Motivo:</strong> <span>{complaint.motivo}</span>
            </div>
            <div className="complaint-detail">
                <strong>Mensaje:</strong> <p className="mensaje">{complaint.mensaje}</p>
            </div>
            <div className="complaint-detail">
                <strong>Estado:</strong> <span>{complaint.estado ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div className="complaint-detail">
                <strong>Fecha:</strong> <span>{new Date(complaint.fecha).toLocaleString()}</span>
            </div>
            <div>
                <button onClick={() => handleDelete(complaint._id)}>Eliminar</button>
                <button onClick={handleBackTo}>Volver</button>
            </div>
        </div>
    )
}

export default ComplaintInfo
