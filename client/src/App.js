import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppContext } from './context/AppContext';

import CreatePost from './components/CreatePost';
import DisplayDoubt from './pages/DisplayDoubt';
// import DisplayFavourites from './components/DisplayFavourites';
import DisplayProfile from './components/DisplayProfile';
import EditProfile from './components/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import Discuss from './pages/Discuss';
import Response from './pages/Response';
import './App.css';

function App() {
  const user = useSelector((state) => state?.user);
  const [status, setStatus] = useState(false);

  const routes = [
    { path: '/', element: <Discuss /> },
    { path: '/view-notes', element: <HomePage /> },
    { path: '/signup', element: user ? <Discuss /> : <Signup /> },
    { path: '/login', element: user ? <Discuss /> : <Login /> },
    { path: '/upload/note', element: user ? <CreatePost /> : <Login /> },
    { path: '/account', element: user ? <DisplayProfile /> : <Login /> },
    // { path: '/starred', element: user ? <DisplayFavourites /> : <Login /> },
    { path: '/edit/profile', element: user ? <EditProfile /> : <Login /> },
    { path: '/doubt', element: <DisplayDoubt /> },
    { path: '/forgot', element: <ForgotPassword /> },
    { path: '/new/password', element: <ResetPassword /> },
    { path: '/response', element: <Response /> },
  ];

  return (
    <AppContext.Provider value={{ user, status, setStatus }}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
