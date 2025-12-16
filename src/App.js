import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Intro from './components/Intro/Intro';
import Gallery from './components/Gallery/Gallery';
import Why from './components/Why/Why';
import Testimonials from './components/Testimonials/Testimonials';
import BookSection from './components/BookSection/BookSection';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import Packages from './components/Packages/Packages';
import Pa1 from './components/Pa1/Pa1';
import Contact from './components/Contact/Contact';
import AdminDashboard from './components/Admin/AdminDashboard';
import PackageDetail from './components/Packages/PackageDetail';
import AdminLogin from './components/Admin/AdminLogin'
import ProtectedRoute from './components/Admin/ProtectedRoute'

// Layout wrapper component for routes with Header/Footer
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <Routes>

        <Route path='/admin/login' element={<AdminLogin />} />
        <Route
          path='/admin'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/"
          element={
            <><PublicLayout>
              <Home />
              <Intro />
              <Why />
              <Gallery />
              <Testimonials />
              <BookSection />
              </PublicLayout>
            </>
          }
        />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/packages" element={<PublicLayout><Packages /></PublicLayout>} />
        <Route path="/pa1" element={<PublicLayout><Pa1 /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:packageId" element={<PackageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;