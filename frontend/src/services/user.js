import axios from 'axios'
import handleAxiosError from '../utils/handleAxiosError'

const baseUrl = 'http://localhost:3000/user'

const userPost = async (user) => {
  try {
    const res = await axios.post(`${baseUrl}/registro`, user)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const userAdminPost = async (user) => {
  try {
    const res = await axios.post(`${baseUrl}/registroAdmin`, user)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const passwordRecovery = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/recuperar-password`, data)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export {
    userPost,
    userAdminPost,
    passwordRecovery
}