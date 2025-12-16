import './Intro.css'
import welcomeImg from './welcome.jpg' // replace with your image path
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import axios from 'axios';


const Intro = () => {

  const navigate = useNavigate();

  const navigateAbout = () => {
    navigate('/about')
  }

  const API_URL = process.env.REACT_APP_API_URL;

  const [homeInfo, setHomeInfo] = useState({
    welcometopic: '',
    welcomepara1: '',
    welcomepara2: ''
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
    <section className="welcome-section">
      <div className="welcome-content">
        <h2>{homeInfo.welcometopic || 'Loading...'}</h2>
        <br />
        <p>
          {homeInfo.welcomepara1 || 'Loading...'}
          <br /><br />
          {homeInfo.welcomepara2 || 'Loading...'}
        </p>
        <button className="welcome-btn" onClick={navigateAbout}>Learn More</button>
      </div>
      <div className="welcome-image">
        <img src={welcomeImg} alt="Welcome to VIP Tours" />
      </div>
    </section>
  )
}

export default Intro
