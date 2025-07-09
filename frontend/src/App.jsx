import { Routes, Route } from "react-router-dom"
import LayOut from "./pages/LayOut"
import Login from "./pages/Login"
import UserForm from './pages/user/UserForm'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route path='login' element={<Login />} />
          <Route path='registro' element={<UserForm />} />
        </Route>
      </Routes>
    </>
  )
}

export default App