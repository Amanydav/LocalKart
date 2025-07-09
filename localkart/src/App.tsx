// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Pages/Navbar';
import Home from './Components/Pages/Home';
import Services from './Components/Pages/Services';
import Provider from './Components/Pages/Provider';
import AuthPage from './Components/Pages/AuthPage';
import ForgotPassword from './Components/Pages/ForgotPassword';
import ACRepair from './Components/Services/AcRepair';
import Electrician from './Components/Services/Electrician';
import Plumbing from './Components/Services/Plumbing';
import Salon from './Components/Services/Salon';
import BookingPage from './Components/Pages/BookingPage';
import Contact from './Components/Pages/Contact';
// import PrivacyPolicy from './Components/Pages/PrivacyPolicy';
import TermsOfService from './Components/Pages/TermsOfService';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/ac-repair" element={<ACRepair />} />
        <Route path="/services/electrician" element={<Electrician />} />
        <Route path="/services/plumbing" element={<Plumbing />} />
        <Route path="/services/salon" element={<Salon />} />
        <Route path="/provider" element={<Provider />} />
         <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/book" element={<BookingPage />} />
        {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;
