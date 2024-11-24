import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Donations from './pages/Donations';
import WildlifeSightings from './pages/WildlifeSightings';
import WildlifeDetails from './pages/WildlifeDetails';
import Tourism from './pages/Tourism';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import User from './pages/User';
import UploadImage from './pages/UploadImage';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      {/* <div className={styles.app}> */}
      <NavBar />
      {/* <main className={styles.mainContent}> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/wildlife-sightings" element={<WildlifeSightings />} />
            <Route path="/wildlife-details/:species" element={<WildlifeDetails />} />
            <Route path="/tourism" element={<Tourism />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />
            <Route path="/upload-image" element={<UploadImage />} />
          </Routes>
        {/* </main> */}
      {/* </div> */}
      <Footer />
    </Router>
  );
}

export default App;
