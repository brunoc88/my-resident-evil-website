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

const myFollowers = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/misSeguidores`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const myFollowed = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/misSeguidos`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const userProfile = async (userName) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/perfil/${userName}`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const follow = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.patch(`${baseUrl}/seguir/${id}`, {}, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const unFollow = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.patch(`${baseUrl}/dejarDeSeguir/${id}`, {}, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const deleteAccount = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.patch(`${baseUrl}/eliminar/${id}`, {}, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const block = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.post(`${baseUrl}/bloquear/${id}`, {}, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const unBlock = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.delete(`${baseUrl}/desbloquear/${id}`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const blockList = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/bloqueados`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const bannedList = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/baneados`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const getUsers = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }
    const res = await axios.get(`${baseUrl}/all`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const reactivateAccount = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await axios.patch(`${baseUrl}/reActivar/${id}`, null, config)
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
  userEdit,
  myFollowers,
  myFollowed,
  userProfile,
  follow,
  unFollow,
  deleteAccount,
  block,
  unBlock,
  blockList,
  bannedList,
  getUsers,
  reactivateAccount
}