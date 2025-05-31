import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";

const App = () => {
    return (
      <Routes>
        <Route path='/' element={<Navbar/>}>
          <Route path='signin' element={<h1>Cặc</h1>}/>
          <Route path='signup' element={<h1>Cặc Lồn</h1>}/>
        </Route>
      </Routes>
    )
}

export default App;