import React, { useState,useEffect } from 'react'
import './Navbar.css'
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {

  const navigate=useNavigate();

  const navigatePackages=()=>{
    navigate('/packages')
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled]=useState(false)

  useEffect(()=>{
const handleScroll=()=>{
  if(window.scrollY>50){
    setIsScrolled(true)
  }else{
    setIsScrolled(false)
  }
}
window.addEventListener("scroll",handleScroll)
return()=>window.removeEventListener("scroll",handleScroll)
  },[])

  return (
<nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-logo">VIP TOURS</div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? "✖" : "☰"}
</div>


      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/packages">Packages</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>

        <button className="book-btn" onClick={navigatePackages}>Book Now</button>
      </ul>
    </nav>
  )
}

export default Navbar
