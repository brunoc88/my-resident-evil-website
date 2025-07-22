import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

const ProtectedRoutes = ({ isAuth, checkingAuth, redirectTo = "/login" }) => {
  const outletContext = useOutletContext()

  if (checkingAuth) return <div>Cargando...</div> // o un spinner

  return isAuth ? <Outlet context={outletContext} /> : <Navigate to={redirectTo} />
}

export default ProtectedRoutes

