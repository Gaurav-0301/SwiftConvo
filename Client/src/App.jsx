import React, { useEffect } from 'react';
import './index.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SettingsPage from './Pages/SettingsPage';
import ProfilePage from './Pages/ProfilePage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import { Loader } from "lucide-react";
import { useAuthStore } from './Store/useAuthStore';

const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth & !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={ authUser?<HomePage />:<Navigate to="/login"/>} />
      <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to="/"/>} />
      <Route path="/settings" element={!authUser?<SettingsPage />:<Navigate to="/"/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login"/>} />
    </Routes>
  );
};

export default App;