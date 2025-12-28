import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/navigation-bar.jsx";
import MainPage from "./pages/MainPage.jsx";
import AboutRestaurant from "./pages/AboutRestraunt.jsx";

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutRestaurant />} />
      </Routes>
    </Router>
  );
}

