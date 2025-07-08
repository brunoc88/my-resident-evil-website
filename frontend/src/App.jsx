import { Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import RegistroUser from "./pages/user/registro"

const App = () => {
  return(
    <>
      <Routes>
        <Route path ='/login' element = {<Login/>}/>
        <Route path = '/registro' element = {<RegistroUser/>}/>
      </Routes>
    </>
  )
}

export default App