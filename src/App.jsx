import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { useEffect, useState, createContext } from "react";
import { lookInSession } from "./common/session";
import GoogleOAuthHandler from "./components/GoogleOAuthHandler";
import Editor from "./pages/editor.pages";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import ManageBlog from "./pages/manage-blogs.page";
import ManageUser from "./pages/manage-user";

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
  console.log(userAuth)

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Toaster />
      <Routes>
        <Route path="/editor" element={<Editor/>}/>
        <Route path="/editor/:blog_id" element={<Editor/>}/>
        <Route path='/' element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path='setting' element={<SideNav/>}>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="usermanage" element={<ManageUser />} />
          </Route>
          <Route path='dashboard' element={<SideNav/>}>
            <Route path="blogs" element={<ManageBlog />} />
          
          </Route>
          <Route path='signin' element={<UserAuthForm type='sign-in' />} />
          <Route path='signup' element={<UserAuthForm type='sign-up' />} />
          <Route path='auth/google' element={<GoogleOAuthHandler />} />
          <Route path='search/:query' element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="blogs/:blog_id" element={<BlogPage/>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}

export default App;