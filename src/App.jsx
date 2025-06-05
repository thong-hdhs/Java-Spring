import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { useEffect, useState, createContext } from "react";
import { lookInSession } from "./common/session";
import GoogleOAuthHandler from "./components/GoogleOAuthHandler";


export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession('user');
    if (userInSession) {
      setUserAuth(JSON.parse(userInSession));
    } else {
      setUserAuth({ accessToken: null });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path='/' element={<Navbar />}>
          <Route path="/" element={<GoogleOAuthHandler />} />
          <Route path='signin' element={<UserAuthForm type='sign-in' />} />
          <Route path='signup' element={<UserAuthForm type='sign-up' />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}

export default App;