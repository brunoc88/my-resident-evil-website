import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyToken } from '../services/token'
import { clearToken } from '../services/token'
import { myProfile } from '../services/user'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const isAuth = !!user
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerReAppUser')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      //setUser(userData.user)
      setToken(userData.token)
      applyToken(userData.token)
    } else {
      setCheckingAuth(false)
    }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await myProfile()
        setUser(res.user)
      } catch (error) {
        console.log(error)
        handleLogout()
      } finally {
        setCheckingAuth(false)
      }
    }

    if (token) {
      loadUser()
    }
  }, [token])



  const handleLogout = () => {
    window.localStorage.removeItem('loggerReAppUser')
    clearToken()
    setUser(null)
    setToken(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      isAuth,
      handleLogout,
      checkingAuth,
      navigate
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
