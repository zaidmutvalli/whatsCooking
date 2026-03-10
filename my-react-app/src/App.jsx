import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt';
import MainPage from './pages/mainPage';
import AddReview from './pages/addReview';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/loginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
<<<<<<< HEAD
=======
import PlacesPage from './pages/PlacesPage';
import SocialPage from './pages/SocialPage';
import TrendingPage from './pages/TrendingPage';
import UserSettings from './pages/user-settings';
>>>>>>> 69f121da4c7145f41742899d71a4ce695fa5b325

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
<<<<<<< HEAD

=======
        <Route path='/places' element={<PlacesPage />} />
        <Route path='/social' element={<SocialPage />} />
        <Route path='/trending' element={<TrendingPage />} />
        <Route path="/user-settings" element={<UserSettings />} />
>>>>>>> 69f121da4c7145f41742899d71a4ce695fa5b325
      </Routes>
    </Router>
  );
}

export default App;