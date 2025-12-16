import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../Navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const images = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/ab2.jpg',
  '/images/image6.jpg',
  '/images/image3.jpg',
  '/images/image5.jpg'
]

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = useNavigate();

  const navigatePackages = () => {
    navigate('/packages')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // change every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const API_URL = process.env.REACT_APP_API_URL;

  const [homeInfo, setHomeInfo] = useState({
    topic: '',
    line: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/vipapi/home`);
        setHomeInfo(res.data);
      } catch (err) {
        console.error("❌ Error fetching home info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeInfo();
  }, []);


  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >

      <div className="hero-content">
        <h1>{homeInfo.topic || 'Loading...'}</h1>
        <p>{homeInfo.line || 'Loading...'}</p>
        <button className="hero-btn" onClick={navigatePackages}>Explore Packages</button>
      </div>
    </div>
  )
}

export default Home
