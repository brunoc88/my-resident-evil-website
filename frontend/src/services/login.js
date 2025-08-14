import axios from 'axios'
import handleAxiosError from '../utils/handleAxiosError'
const baseUrl = 'http://localhost:3000/'

const login = async ({ user, password }) => {
  try {
    const res = await axios.post(baseUrl, { user, password })
    return res.data
  } catch (error) {
    // Aquí extraemos el mensaje que vino del backend, sea error o mensaje
    handleAxiosError(error)
  }
}


export default login