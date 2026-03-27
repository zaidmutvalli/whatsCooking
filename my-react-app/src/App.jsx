import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
import PublicProfile from "./pages/PublicProfile";

const authRoutes = ['/login', '/signup', '/forgotpassword', '/resetpassword'];

function ConditionalNavBar() {
  const location = useLocation();
  if (authRoutes.includes(location.pathname.toLowerCase())) return null;
  return <NavBar />;
}

function App() {
  return (
    <Router>
      <ConditionalNavBar />
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
        <Route path="/profile/:userId" element={<PublicProfile />} /> 

      </Routes>
    </Router>
  );
}

export default App;