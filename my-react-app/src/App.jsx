import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import NavBar from "./Components/navigation-bar";
import MainPage from "./pages/mainPage"; 

import AboutRestaurant from "./pages/AboutRestraunt"; 
import UserSettings from "./pages/user-settings";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* This tells the app: When at '/', show MainPage */}
        <Route path="/" element={<MainPage />} />
        
        {/* This tells the app: When at '/about', show AboutRestaurant */}
        <Route path="/about" element={<AboutRestaurant />} />

        <Route path="/user-settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;