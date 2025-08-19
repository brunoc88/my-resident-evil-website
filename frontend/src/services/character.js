import { getToken } from "./token"
import handleAxiosError from '../utils/handleAxiosError'
import api from './api'



const characterPost = async (data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.post(`personaje/alta`, data, config)
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

        const res = await api.patch(`personaje/${id}/like`, {}, config)
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

        const res = await api.patch(`personaje/${id}/unlike`, {}, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const getComments = async (id) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.get(`personaje/${id}/comentarios`, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const postComment = async (id, data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')
        
        let config = {
            headers: { Authorization: token }
        }

        const res = await api.post(`personaje/${id}/comentario`, data, config)
        return res.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const deleteCommentById = async (id, idComentario) => {
    try {
        let token = getToken()
        if(!token) throw new Error('Falta token!')

        let config = {
            headers: { Authorization: token }
        }
        
        const res = await api.patch(`personaje/${id}/comentario/${idComentario}`, {}, config)
        return res.data 

    } catch (error) {
        handleAxiosError(error)
    }
}

const editCommentById = async (id, idComentario, data) => {
    try {
        let token = getToken()
        if(!token) throw new Error('Falta token!')

        let config = {
            headers: { Authorization: token }
        }
        
        const res = await api.put(`personaje/${id}/comentario/${idComentario}`, data, config)
        return res.data 

    } catch (error) {
        handleAxiosError(error)
    }
}

const deleteCharacterById = async (id) => {
    try {
        let token = getToken()
        if(!token) throw new Error('Falta token!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.patch(`personaje/eliminar/${id}/`, {}, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const editCharacterById = async (id, data) => {
    try {
        let token = getToken()
        if(!token) throw new Error('Falta token!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.put(`personaje/editar/${id}/`, data, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}
// rutas publica
const characterList = async () => {
    try {
        const res = await api.get(`personaje/all`)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const getCharacterById = async (id) => {
    try {
        const res = await api.get(`personaje/${id}`)
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
    getComments,
    postComment,
    deleteCommentById,
    editCommentById,
    deleteCharacterById,
    editCharacterById
}