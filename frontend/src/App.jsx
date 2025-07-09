import { Routes, Route } from "react-router-dom"
import LayOut from "./pages/LayOut"
import Login from "./pages/Login"
import RegistroUser from "./pages/user/registro"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route path='login' element={<Login />} />
          <Route path='registro' element={<RegistroUser />} />
        </Route>
      </Routes>
    </>
  )
}

export default App