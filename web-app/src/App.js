import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import SecondaryNavBar from './components/SecondaryNavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Donations from './pages/Donations';
import WildlifeSightings from './pages/WildlifeSightings';
import WildlifeDetails from './pages/WildlifeDetails';
import Tourism from './pages/Tourism';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login'; // Import login page
import Register from './pages/Register'; // Import register page
import Admin from './pages/Admin'; // Create these pages for admin and user redirection
import User from './pages/User';
import UploadImage from './pages/UploadImage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <MainNavBar />
      <SecondaryNavBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/wildlife-sightings" element={<WildlifeSightings />} />
          <Route path="/wildlife-details/:species" element={<WildlifeDetails />} />
          <Route path="/tourism" element={<Tourism />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route path="/register" element={<Register />} /> {/* Register route */}
          <Route path="/admin" element={<Admin />} /> {/* Admin redirect */}
          <Route path="/user" element={<User />} /> {/* User redirect */}
          <Route path="/upload-image" element={<UploadImage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
