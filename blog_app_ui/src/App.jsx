import React, { useEffect } from 'react'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Blogs from './pages/Blogs'
import CreateBlog from './pages/CreateBlog'
import ReadBlogs from './pages/ReadBlogs'
import EditBlog from './pages/EditBlog'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUser } from './slices/auth/authSlice'
import { ToastContainer } from 'react-toastify'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import EditProfile from './pages/EditProfile'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get('http://localhost:3000/me', { withCredentials: true });
        dispatch(setUser(user?.data));
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [])

  return (
    <div className="bg-[#F7F4ED] text-black dark:bg-[#111827] dark:text-white min-h-screen transition-colors duration-300">
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          draggable
          pauseOnHover
          theme="dark"
        />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<AuthPage type={"signup"} />} />
          <Route path='/login' element={<AuthPage type={"login"} />} />
          <Route path='/blog' element={<Blogs />} />
          <Route path='/createblog' element={<CreateBlog />} />
          <Route path='/readblog/:id' element={<ReadBlogs />} />
          <Route path='/blog/edit/:id' element={<EditBlog />} />
          <Route path='/:username' element={<Profile />} />
          <Route path='/:username/saved-blogs' element={<Profile />}  />
          <Route path='/:username/liked-blogs' element={<Profile />}  />
          <Route path='/profile/edit' element={<EditProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
