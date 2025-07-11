import axios from 'axios'
const baseUrl = 'http://localhost:3000/'

const login = async ({ user, password }) => {
  try {
    const res = await axios.post(baseUrl, { user, password })
    return res.data
  } catch (error) {
    // Aquí extraemos el mensaje que vino del backend, sea error o mensaje
    const data = error.response?.data
    if (data?.error) throw new Error(data.error)
    if (data?.message) throw new Error(data.message)
    throw new Error('Error desconocido')
  }
}


export default login