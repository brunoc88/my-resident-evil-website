import axios from 'axios'

let logoutCallback = null

export const setLogoutCallback = (callback) => {
  logoutCallback = callback
}

// Instancia central de axios
const api = axios.create({
  baseURL: 'http://localhost:3000/',
})

// Interceptor de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      if (logoutCallback) logoutCallback()
    }
    return Promise.reject(error)
  }
)

export default api