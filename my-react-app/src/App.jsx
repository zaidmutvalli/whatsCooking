import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import NavBar from "./Components/navigation-bar";
import MainPage from "./pages/mainPage"; 

import AboutRestaurant from "./pages/AboutRestraunt"; 

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* This tells the app: When at '/', show MainPage */}
        <Route path="/" element={<MainPage />} />
        
        {/* This tells the app: When at '/about', show AboutRestaurant */}
        <Route path="/about" element={<AboutRestaurant />} />
      </Routes>
    </Router>
  );
}

export default App;