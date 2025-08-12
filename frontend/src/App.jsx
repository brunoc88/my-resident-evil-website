import { Routes, Route } from "react-router-dom"
import LayOut from "./components/LayOut"
import Login from "./pages/Login"
import UserForm from "./pages/user/UserForm"
import PasswordRecovery from "./pages/user/PasswordRecovery"
import Nosotros from "./pages/Nosotros"
import Contactanos from "./pages/Contactanos"
import NotFound from "./pages/NotFound"
import CharacterForm from "./pages/character/CharacterForm"
import ProtectedRoutes from "./components/ProtectedRoutes"
import CharacterIndex from "./pages/character/CharacterIndex"
import CharacterProfile from "./pages/character/CharacterProfile"
import Profile from "./pages/user/Profile"
import FollowList from "./pages/user/FollowList"
import BlockList from "./pages/user/BlockList"
import BannedList from "./pages/user/BannedList"
import Searching from "./pages/user/Searching"
import Complaint from "./pages/complaints/Complaint"
import ComplaintLinst from "./pages/complaints/ComplaintList"
import ComplaintInfo from "./pages/complaints/ComplaintInfo"
import MessageList from "./pages/user/MessageList"
import Message from "./pages/user/Message"

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          {/* Rutas publicas */}
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<UserForm />} />
          <Route path="registroAdmin" element={<UserForm isAdmin={true} />} />
          <Route path="recuperarPassword" element={<PasswordRecovery />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contactos" element={<Contactanos />} />
          <Route path="personajes/">
            <Route path="index" element={<CharacterIndex />} />
            <Route path=":id" element={<CharacterProfile />} />
          </Route>
          {/* Rutas protegidas */}
          <Route path="user/" element={<ProtectedRoutes />}>
            <Route path="editar" element={<UserForm />} />
            <Route path="miPerfil" element={<Profile/>}/>
            <Route path="perfil/:userName" element={<Profile/>}/>
            <Route path="followList" element={<FollowList/>}/>
            <Route path="bloqueados" element={<BlockList/>}/>
            <Route path="baneados" element={<BannedList/>}/>
            <Route path="buscar" element={<Searching/>}/>
            <Route path="mensajes/resumen" element={<MessageList/>}/>
            <Route path="mensajes/:id" element={<Message/>}/>
          </Route>
          <Route path="personajes/" element={<ProtectedRoutes />}>
            <Route path="registro" element={<CharacterForm />} />
            <Route path="editar/:id" element={<CharacterForm editMode = {true} />} />
          </Route>
          <Route path="denuncias/" element={<ProtectedRoutes />}>
            <Route path="lista" element={<ComplaintLinst/>}/>
            <Route path="info/:id" element={<ComplaintInfo/>}/>
            <Route path="crear/usuario/:userName/:id" element={<Complaint/>}/>
            <Route path="crear/personaje/:personaje/:id" element={<Complaint/>}/>
          </Route>
          {/* Ruta 404 fuera del layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App