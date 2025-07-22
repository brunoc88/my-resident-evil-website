import axios from 'axios'
import handleAxiosError from '../utils/handleAxiosError'
import { getToken } from './token'


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

const myProfile = async () => {
  let token = getToken()
  try {
    if (!token) {
      throw new Error('Acceso invalido!')
    }

    let config = {
      headers: { Authorization: token }
    }

    const res = await axios.get(`${baseUrl}/miPerfil`, config)
    
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const userEdit = async (id, data) => {
  try {
    let token = getToken()

    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await axios.put(`${baseUrl}/editar/${id}`, data, config)

    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

export {
  userPost,
  userAdminPost,
  passwordRecovery,
  myProfile, 
  userEdit
}