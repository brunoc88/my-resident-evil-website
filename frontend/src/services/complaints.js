import axios from 'axios'
import { getToken } from "./token"
import handleAxiosError from '../utils/handleAxiosError'

const baseUrl = 'http://localhost:3000/denuncias/'

const makeComplaint = async (data) => {
    try {
        let token = getToken()
        if (!token) throw new Error('Acceso invalido!')

        let config = {
            headers: { Authorization: token }
        }

        const res = await axios.post(`${baseUrl}`, data, config)
        return res.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export {
    makeComplaint
}