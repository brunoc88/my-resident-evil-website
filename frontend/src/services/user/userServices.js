import axios from 'axios'

const baseUrl = 'http://localhost:3000/'

const userPost = async (user) => {
    try {
        const res = await axios.post(`${baseUrl}/registro`, user)
        return res.data
    } catch (error) {
        return Promise.reject(error.response?.data || { message: 'Error desconocido' })
    }
}

export {
    userPost
}