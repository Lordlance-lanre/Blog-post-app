import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AppGuard from './middleware/authguard';
import Home from './pages/Home';
import CreateBlog from './pages/Blogs/createBlog';
import ViewBlogs from './pages/Blogs/viewBlogs';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<AppGuard />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs/create" element={<CreateBlog />} />
            <Route path="/blogs/all-posts" element={<ViewBlogs />} />
          </Route>
        </Routes>
      </Provider>
    </>
  )
}

export default App
