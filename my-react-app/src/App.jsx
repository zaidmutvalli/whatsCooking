<<<<<<< HEAD
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import NavBar from "./Components/navigation-bar";
import MainPage from "./pages/mainPage"; 

import AboutRestaurant from "./pages/AboutRestraunt"; 
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt';
import MainPage from './pages/mainPage'; 
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/loginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
>>>>>>> remotes/origin/signup_page_combine_branches

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
<<<<<<< HEAD
        {/* This tells the app: When at '/', show MainPage */}
        <Route path="/" element={<MainPage />} />
        {/* This tells the app: When at '/about', show AboutRestaurant */}
        <Route path="/about" element={<AboutRestaurant />} />
=======
        <Route path='/' element={<MainPage />} />
        <Route path='/about' element={<AboutRestaurant />} />
        <Route path='/signUp' element={<SignUpPage />} />
        <Route path='/logIn' element={<LogInPage />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />

>>>>>>> remotes/origin/signup_page_combine_branches
      </Routes>
    </Router>
  );
}

export default App;