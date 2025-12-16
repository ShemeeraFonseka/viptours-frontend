import React, { useState, useEffect } from 'react';
import './Gallery.css';
import axios from 'axios';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/vipapi/gallery`);
      setGalleryItems(res.data);
    } catch (err) {
      console.error("❌ Error fetching gallery items:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="gallery-section">
        <h2>Explore Our Destinations</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <h2>Explore Our Destinations</h2>
      <div className="gallery-masonry">
        {galleryItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
            <p>No gallery items available</p>
          </div>
        ) : (
          galleryItems.map((item) => (
            <div key={item._id} className="gallery-item">
              <img 
                src={`${API_URL}/${item.image}`} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'; // Fallback image
                }}
              />
              <p className="gallery-name">{item.name}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Gallery;