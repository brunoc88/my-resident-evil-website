import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import LayOut from "./components/LayOut"
import Login from "./pages/Login"
import UserForm from "./pages/user/userForm"


const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const isAuth = !!user // <-- isAuth sera verdadera si user no es null||undefined

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggerReAppUser')
    if (loggedUserJSON) {
      const userData = JSON.parse(loggedUserJSON)
      setUser(userData.user)
      setToken(userData.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggerReAppUser')
    setUser(null)
    setToken(null)
  }


  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut isAuth={isAuth} user={user} onLogout={handleLogout}/>}>
          <Route path="login" element={<Login setToken={setToken} setUser={setUser} user={user} isAuth={isAuth} />} />
          <Route path="registrarse" element={<UserForm/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App