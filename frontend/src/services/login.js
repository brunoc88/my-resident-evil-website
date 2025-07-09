import axios from 'axios'
const baseUrl = 'http://localhost:3000/'

const login = async ({ user, password }) => {
    try {
        const res = await axios.post(baseUrl, {user, password})
        return res.data
    } catch (error) {
        throw error.response?.data || { message: 'Error desconocido' }
    }
}

export default login