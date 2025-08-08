import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { userProfile } from "../../services/user.js"
import { getCharacterById } from "../../services/character.js"

const Complaint = () => {
    const { personaje, userName, id } = useParams() // <-- aca vamos a extraer de la app.jsx 
    // si el parametro es personaje osea si no es null hacemos la denuncia del personaje
    // sino hacemos la denuncia de un usaurio
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({mode: 'onChange'})
    
    return (
        <div>
            <div>
                Realice su denuncia:
            </div>
        </div>
    )
}

export default Complaint