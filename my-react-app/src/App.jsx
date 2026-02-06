import React from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import NavBar from "./Components/navigation-bar";
import MainPage from "./pages/mainPage"; 
import AddReview from './pages/addReview';
import AboutRestaurant from "./pages/AboutRestraunt"; 

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutRestaurant />} />
        <Route path="/addReview" element={<AddReview/>} />

        <></>
      </Routes>
    </Router>
  );
}

export default App;