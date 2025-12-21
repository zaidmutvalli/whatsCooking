import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/aboutRestraunt'; 
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
        <Route path='/about' element={<AboutRestaurant />} />
        <Route path='/signUpPage' element={<SignUpPage />} />
        <Route path='/logInPage' element={<LogInPage />} />

      </Routes>
    </Router>
  );
}
