// React Router imports for client-side navigation
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component and page imports
import NavBar from './Components/navigation-bar';
import AboutRestaurant from './pages/AboutRestraunt';
import MainPage from './pages/mainPage';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/loginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Root application component — wraps the app in a router and defines all page routes
function App() {
  return (
    <Router>
      {/* Navigation bar rendered on every page */}
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

export default App;