import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt';
import MainPage from './pages/mainPage';
import AddReview from './pages/addReview';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/loginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PlacesPage from './pages/PlacesPage';
import SocialPage from './pages/SocialPage';
import TrendingPage from './pages/TrendingPage';
import UserSettings from "./pages/user-settings";








function App() {
  return (
    <Router>
      <NavBar />
      <Routes>

        <Route path='/' element={<MainPage />} />
        <Route path='/about' element={<AboutRestaurant />} />
        <Route path='/addReview' element={<AddReview />} />
        <Route path='/signUp' element={<SignUpPage />} />
        <Route path='/logIn' element={<LogInPage />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/places' element={<PlacesPage />} />
        <Route path='/social' element={<SocialPage />} />
        <Route path='/trending' element={<TrendingPage />} />
        <Route path="/user-settings" element={<UserSettings />} /> 
      </Routes>
    </Router>
  );
}

export default App;