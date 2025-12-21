import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/aboutRestraunt'; 
import MainPage from './pages/mainPage';





export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/about' element={<AboutRestaurant />} />
       
        

      </Routes>
    </Router>
  );
}
