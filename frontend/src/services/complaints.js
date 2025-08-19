import { getToken } from "./token"
import handleAxiosError from '../utils/handleAxiosError'
import api from './api'


const makeComplaint = async (data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.post(`denuncias`, data, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const getComplaits = async () => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.get(`denuncias/`, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

const deleteComplaint = async (id) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await api.patch(`denuncias/${id}/resolver`, {}, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}
export {
    makeComplaint,
    getComplaits,
    deleteComplaint
}