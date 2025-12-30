import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt';
import MainPage from './pages/mainPage'; 
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LogInPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/about' element={<AboutRestaurant />} />
        <Route path='/signUp' element={<SignUpPage />} />
        <Route path='/logIn' element={<LogInPage />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}
