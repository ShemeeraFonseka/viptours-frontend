import React, { useEffect, useState } from 'react'
import './About.css'
import Gallery from '../Gallery/Gallery'
import axios from 'axios'

const About = () => {

  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAboutData();
  }, [])

  const fetchAboutData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/vipapi/about`)
      setAboutData(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching about data:', err)
      setError('Failed to load content. Showing default content')
      setAboutData(getDefaultData())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultData = () => ({
    section1: {
      heading: 'About VIP Tours',
      paragraph1: 'We believe travel is more than just visiting places — it\'s about discovering stories, meeting people, and creating memories that last a lifetime. With years of experience in Sri Lanka\'s travel industry, our dedicated team curates personalized tours that capture the island\'s natural beauty and cultural richness.',
      paragraph2: 'From golden beaches to misty mountain escapes, from vibrant cityscapes to tranquil temples — every journey we offer is crafted with care and passion. Our mission is to connect travelers with the authentic essence of Sri Lanka — its warm hospitality, breathtaking landscapes, and timeless traditions.',
      image: '/images/about.jpg'
    },
    section2: {
      paragraph1: 'At VIP Tours, we don\'t just plan trips — we design immersive journeys that celebrate Sri Lanka\'s diversity. Our expert guides bring destinations to life through captivating stories, hidden trails, and insider experiences that only locals know.',
      paragraph2: 'With sustainable and responsible tourism at the heart of what we do, we strive to preserve Sri Lanka\'s beauty for generations to come. From eco-friendly tours to supporting local artisans, every step of your journey with VIP Tours contributes to something meaningful.',
      paragraph3: 'We take pride in being more than a travel company — we\'re your trusted companion in exploration. Our commitment to safety, comfort, and authenticity ensures that every traveler feels both inspired and cared for.',
      image: '/images/ab2.jpg'
    }
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/about.jpg';
    if (imagePath.startsWith('http') || imagePath.startsWith('/images')) {
      return imagePath;
    }
    return `${API_URL.replace('/api', '')}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const data = aboutData || getDefaultData();

  return (
    <div>
      <section className="about-section">
        <div className="about-container">
          {/* Left Side — Text */}
          <div className="about-text">
            <h2>{data.section1.heading}</h2>
            <p>{data.section1.paragraph1}</p>
            <p>{data.section1.paragraph2}</p>
          </div>

          {/* Right Side — Gallery */}
          <div className="about-gallery">
            <div className="gallery-item">
              <img
                src={getImageUrl(data.section1.image)}
                alt="VIP Tours Experience"
                onError={(e) => { e.target.src = '/images/about.jpg'; }}
              />
            </div>

          </div>
        </div>
        <br /><br />
        <div className="about-container">
          {/* Right Side — Gallery */}
          <div className="about-gallery">
            <div className="gallery-item">
              <img
                src={getImageUrl(data.section2.image)}
                alt="VIP Tours Journey"
                onError={(e) => { e.target.src = '/images/ab2.jpg'; }}
              />
            </div>

          </div>
          {/* Left Side — Text */}
          <div className="about-text">
            <p>{data.section2.paragraph1}</p>
            <p>{data.section2.paragraph2}</p>
            <p>{data.section2.paragraph3}</p>
          </div>


        </div>

      </section>

      {error && (
        <div className="error-message" style={{
          padding: '10px',
          background: '#fff3cd',
          color: '#856404',
          textAlign: 'center',
          margin: '20px'
        }}>
          {error}
        </div>
      )}


      <Gallery />
    </div>
  )
}

export default About
