import handleAxiosError from '../utils/handleAxiosError'
import api from './api'

const login = async ({ user, password }) => {
  try {
    const res = await api.post('',{ user, password })
    return res.data
  } catch (error) {
    // Aquí extraemos el mensaje que vino del backend, sea error o mensaje
    handleAxiosError(error)
  }
}

export default login