import { Routes, Route } from "react-router-dom"
import LayOut from "./components/LayOut"
import Login from "./pages/Login"
import UserForm from "./pages/user/UserForm"
import PasswordRecovery from "./pages/user/PasswordRecovery"
import Nosotros from "./pages/Nosotros"
import Contactanos from "./pages/Contactanos"
import NotFound from "./pages/NotFound"
import ProtectedRoutes from "./components/ProtectedRoutes"


const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          {/* Rutas publicas */}
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<UserForm  />} />
          <Route path="registroAdmin" element={<UserForm isAdmin={true} />} />
          <Route path="recuperarPassword" element={<PasswordRecovery />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contactos" element={<Contactanos />} />

          {/* Rutas protegidas */}
          <Route path="user/" element={<ProtectedRoutes />}>
            <Route path="editar" element={<UserForm />} />
          </Route>
          {/* Ruta 404 fuera del layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App