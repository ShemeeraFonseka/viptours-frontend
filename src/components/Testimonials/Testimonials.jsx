import React, { useState, useEffect } from 'react';
import './Testimonials.css';
import { FaQuoteLeft } from 'react-icons/fa';
import axios from 'axios';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Fetch only active testimonials for public display
      const res = await axios.get(`${API_URL}/vipapi/testimonials/active`);
      setTestimonials(res.data);
    } catch (err) {
      console.error("❌ Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="testimonial-section">
        <h2>What Our Travelers Say</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonial-section">
      <h2>What Our Travelers Say</h2>
      <div className="testimonial-container">
        {testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
            <p>No testimonials available</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div key={t._id} className="testimonial-card">
              <FaQuoteLeft className="quote-icon" />
              <p className="testimonial-text">"{t.quote}"</p>
              <div className="testimonial-user">
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Testimonials;