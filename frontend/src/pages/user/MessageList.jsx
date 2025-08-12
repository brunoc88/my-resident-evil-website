import { useState, useEffect } from "react"
import { useOutletContext } from 'react-router-dom'
import { messageResumen } from "../../services/user"

const MessageList = () => {
    const {setNotificaiton} = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [inboxMessages, setInboxMessages] = useState(null)

    useEffect(()=>{
        const loadInboxMessages = async () => {
            try {
                const res = await messageResumen()
                if(res && res.mensajes){
                    setInboxMessages(res.mensajes)
                }
            } catch (error) {
                setNotificaiton({error:error.message || `hubo un problema ${error}`, exito:''})
                setTimeout(() => {
                    setNotificaiton({error:'', exito:''})
                }, 5000)
            }finally{
                setLoading(false)
            }
        }

        if(loading) loadInboxMessages()
    },[])

    if(loading) return <p>Cargando...</p>

    if(!inboxMessages || inboxMessages.length === 0) {
        return (
            <div>
                <h1>Bandeja de entrada</h1>
                <p>No tiene mensajes!</p>
            </div>
        )
    }

    return (
        <div>
            mensaje de 
        </div>
    )
}

export default MessageList