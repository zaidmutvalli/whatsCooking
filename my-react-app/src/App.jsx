import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt'; 
import MainPage from './pages/mainPage';
import LoginPage from './pages/loginPage';





export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/about' element={<AboutRestaurant />} />
        <Route path='/login' element={<LoginPage />} />
       
        

      </Routes>
    </Router>
  );
}
