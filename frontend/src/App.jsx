import { Routes, Route } from "react-router-dom"
import LayOut from "./components/LayOut"
import Login from "./pages/Login"


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </>
  )
}

export default App