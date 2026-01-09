import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../Navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState([]);
  const navigate = useNavigate();

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
        
        // Set carousel images from GridFS or use defaults
        if (res.data.carouselImages && res.data.carouselImages.length > 0) {
          setCarouselImages(res.data.carouselImages.map(
            img => `${API_URL}/vipapi/images/${img}` // Changed to GridFS image route
          ));
        } else {
          // Fallback to default images if none uploaded
          setCarouselImages([
            '/images/slide1.jpg',
            '/images/slide2.jpg',
            '/images/slide3.jpg',
            '/images/ab2.jpg',
            '/images/image6.jpg',
            '/images/image3.jpg',
            '/images/image5.jpg'
          ]);
        }
      } catch (err) {
        console.error("❌ Error fetching home info:", err);
        // Set default images on error
        setCarouselImages([
          '/images/slide1.jpg',
          '/images/slide2.jpg',
          '/images/slide3.jpg'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeInfo();
  }, [API_URL]);

  useEffect(() => {
    if (carouselImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselImages]);

  const navigatePackages = () => {
    navigate('/packages');
  };

  if (loading) {
    return (
      <div className="home-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${carouselImages[currentIndex]})` }}
    >
      <div className="hero-content">
        <h1>{homeInfo.topic || 'Welcome to VIP Tours'}</h1>
        <p>{homeInfo.line || 'Discover amazing destinations'}</p>
        <button className="hero-btn" onClick={navigatePackages}>Explore Packages</button>
      </div>
    </div>
  );
};

export default Home;