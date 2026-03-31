import React, { useEffect } from 'react';
import './index.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SettingsPage from './Pages/SettingsPage';
import ProfilePage from './Pages/ProfilePage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import { Loader } from "lucide-react";
import { useAuthStore } from './Store/useAuthStore';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './Store/useThemeStore';
import Navbar from './Components/Navbar';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
 const {theme}=useThemeStore();
 useEffect(() => {
   
   document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // Fix: Use && instead of &
  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  );

  return (
    <div >
          <Navbar/>
      <Routes>
     
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        
     
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        
        
        <Route path="/settings" element={<SettingsPage />} /> 
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;