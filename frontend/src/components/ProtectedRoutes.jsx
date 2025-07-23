import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoutes = () => {
  const { isAuth, checkingAuth } = useAuth()
  const context = useOutletContext()

  if (checkingAuth) return <div>Cargando...</div> // o un spinner
  return isAuth ? <Outlet context={context}/> : <Navigate to="/login" />
}


export default ProtectedRoutes

