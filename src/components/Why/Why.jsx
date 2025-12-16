import React, { useState, useEffect } from 'react' // Added missing imports
import './Why.css'
import { FaGlobeAsia, FaUsers, FaMapMarkedAlt, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Added missing import

const Why = () => {

   const navigate = useNavigate();
   const API_URL = process.env.REACT_APP_API_URL;

  const navigateContact = () => {
    navigate('/contact')
  }

  const [homeInfo, setHomeInfo] = useState({
    servicetopic1: '',
    servicepara1: '',
    servicetopic2: '',
    servicepara2: '',
    servicetopic3: '',
    servicepara3: '',
    servicetopic4: '',
    servicepara4: ''
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
  }, [API_URL]);

  // Create dynamic reasons array from API data
  const reasons = [
    {
      icon: <FaGlobeAsia />,
      title: homeInfo.servicetopic1 || 'Local Expertise',
      desc: homeInfo.servicepara1 || 'Our team knows Sri Lanka inside out — from hidden beaches to cultural gems, we craft authentic local experiences.',
    },
    {
      icon: <FaUsers />,
      title: homeInfo.servicetopic2 || 'Personalized Service',
      desc: homeInfo.servicepara2 || 'We tailor every tour to your preferences, ensuring comfort, convenience, and unforgettable memories.',
    },
    {
      icon: <FaMapMarkedAlt />,
      title: homeInfo.servicetopic3 || 'Comprehensive Packages',
      desc: homeInfo.servicepara3 || 'From accommodation to activities, we handle every detail so you can relax and enjoy the adventure.',
    },
    {
      icon: <FaStar />,
      title: homeInfo.servicetopic4 || 'Trusted by Travelers',
      desc: homeInfo.servicepara4 || 'Thousands of happy travelers have trusted VIP Tours to make their Sri Lankan journey truly special.',
    },
  ]

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="why-section">
      <h2>Why Choose VIP Tours</h2>
      <br />
      <div className="why-cards">
        {reasons.map((item, index) => (
          <div key={index} className="why-card">
            <div className="why-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
      <br /><br /><br />
       <button className="contact-btn" onClick={navigateContact}>Contact Us</button>
    </section>
  )
}

export default Why