import React from 'react'
import './Footer.css'
import { FaFacebookF, FaInstagram, FaTwitter, FaTripadvisor } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const Footer = () => {

  const navigate=useNavigate();

  const navigateHome=()=>{
    navigate('/')
  }

   const navigatePackages=()=>{
    navigate('/packages')
  }

   const navigateAbout=()=>{
    navigate('/about')
  }

  const navigateContact=()=>{
    navigate('/contact')
  }


  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and About */}
        <div className="footer-brand">
          <h2 className="footer-logo">VIP TOURS</h2>
          <p>
            Discover the true beauty of Sri Lanka with VIP Tours — where every journey is
            personalized, comfortable, and unforgettable.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={navigateHome}>Home</li>
            <li onClick={navigatePackages}>Packages</li>
            <li onClick={navigateAbout}>About Us</li>
            <li onClick={navigateContact}>Contact</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaTripadvisor /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Flego Innovation. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
