import { BrowserRouter, Route,Routes } from "react-router-dom"
import  Signup from './pages/Signup.tsx'
import  Signin  from './pages/Singin.tsx'
import Blog  from './pages/Blog'


function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signip" element={<Signin/>}/>
      <Route path="/blog" element={<Blog/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
