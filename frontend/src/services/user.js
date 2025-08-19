import handleAxiosError from '../utils/handleAxiosError'
import { getToken } from './token'
import api from './api'

const userPost = async (user) => {
  try {
    const res = await api.post(`user/registro`, user)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const userAdminPost = async (user) => {
  try {
    const res = await api.post(`user/registroAdmin`, user)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const passwordRecovery = async (data) => {
  try {
    const res = await api.post(`user/recuperar-password`, data)
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

    const res = await api.get(`user/miPerfil`, config)

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

    const res = await api.put(`user/editar/${id}`, data, config)

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
    const res = await api.get(`user/misSeguidores`, config)
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
    const res = await api.get(`user/misSeguidos`, config)
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
    const res = await api.get(`user/perfil/${userName}`, config)
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
    const res = await api.patch(`user/seguir/${id}`, {}, config)
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
    const res = await api.patch(`user/dejarDeSeguir/${id}`, {}, config)
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
    const res = await api.patch(`user/eliminar/${id}`, {}, config)
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
    const res = await api.post(`user/bloquear/${id}`, {}, config)
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
    const res = await api.delete(`user/desbloquear/${id}`, config)
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
    const res = await api.get(`user/bloqueados`, config)
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
    const res = await api.get(`user/baneados`, config)
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
    const res = await api.get(`user/all`, config)
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

    const res = await api.patch(`user/reActivar/${id}`, null, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const messageResumen = async () => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await api.get(`user/mensajes/resumen`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const sendMessage = async (id, data) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await api.post(`user/mensaje/${id}`, data, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const getChats = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await api.get(`user/mensajes/chat/${id}`, config)
    return res.data
  } catch (error) {
    handleAxiosError(error)
  }
}

const deleteMessage = async (id) => {
  try {
    let token = getToken()
    if (!token) throw new Error('Acceso invalido!')

    let config = {
      headers: { Authorization: token }
    }

    const res = await api.patch(`user/mensaje/${id}`, {}, config)
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
  reactivateAccount,
  messageResumen,
  sendMessage,
  getChats,
  deleteMessage
}