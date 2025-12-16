import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css'

const Contact = () => {

  const API_URL = process.env.REACT_APP_API_URL;

  const [contactInfo, setContactInfo] = useState({
    mobile: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/vipapi/contact-info`);
        setContactInfo(res.data);
      } catch (err) {
        console.error("❌ Error fetching contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <section className="contactus-section">
      <h2>Contact Us</h2>
      <div className="contactus-image">
          <img src="/images/image.jpg" alt="Contact" />
        </div>

      <div className="contactus-container">

        {/* Left: Contact Image */}
        

        {/* Middle: Contact Details */}
        <div className="contactus-details">
            <br />
          <h3>Get in Touch</h3>
          <p>We’re here to help you plan the perfect trip!</p>

         
          <div className="detail-item">
            <span>📞</span>
            <p>{contactInfo.mobile || 'Loading...'}</p>
          </div>

          <div className="detail-item">
            <span>✉️</span>
            <p>{contactInfo.email || 'Loading...'}</p>
          </div>

          
        </div>

        {/* Right: Contact Form */}
        <form className="contactus-form">
          <h3>Send Us a Message</h3>

          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>

          <button type="submit" className="send-btn">Send Message</button>
        </form>

      </div>
    </section>
  )
}

export default Contact
