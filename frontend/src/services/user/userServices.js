import axios from 'axios'

const baseUrl = 'http://localhost:3000'

const userPost = async (user) => {
    try {
        const res = await axios.post(`${baseUrl}/user/registro`, user)
        return res.data
    } catch (error) {
        const data = error.response?.data
        if (data?.error) throw new Error(data.error)
        if (data?.message) throw new Error(data.message)
        throw new Error('Error desconocido')
    }
}

export {
    userPost
}