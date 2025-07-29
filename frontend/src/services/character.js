import axios from 'axios'
import { getToken } from "./token"
import handleAxiosError from '../utils/handleAxiosError'

const baseUrl = 'http://localhost:3000/personaje'


const characterPost = async (data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.post(`${baseUrl}/alta`, data, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const sendLike = async (id) => {
    try {
        const token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        const config = {
            headers: { Authorization: token }
        }

        const res = await axios.patch(`${baseUrl}/${id}/like`, {}, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const sendUnlike = async (id) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.patch(`${baseUrl}/${id}/unlike`, {}, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const getComments = async (id) => {
    console.log("id",id)
    console.log("DENTRO DE LA FUNCION")
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        console.log("token", token)
        let config = {
            headers: { Authorization: token }
        }
        console.log("LLAMANDO A:", `${baseUrl}/${id}/comentarios`)

        const res = await axios.get(`${baseUrl}/${id}/comentarios`, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}
// rutas publica
const characterList = async () => {
    try {
        const res = await axios.get(`${baseUrl}/all`)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const getCharacterById = async (id) => {
    try {
        const res = await axios.get(`${baseUrl}/${id}`)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export {
    characterPost,
    characterList,
    getCharacterById,
    sendLike,
    sendUnlike,
    getComments
}