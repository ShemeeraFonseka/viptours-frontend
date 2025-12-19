import React, { useState, useEffect } from 'react';
import './Packages.css';
import { Link } from "react-router-dom";
import axios from 'axios';

const Packages = () => {
  const [packagesData, setPackagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Fetch only active packages for public display
      const res = await axios.get(`${API_URL}/vipapi/packages/active`);
      setPackagesData(res.data);
    } catch (err) {
      console.error("❌ Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="packages-section">
        <h2 className="packages-title">Our Tour Packages</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading packages...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="packages-section">
      <h2 className="packages-title">Our Tour Packages</h2>
      <div className="packages-container">
        {packagesData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
            <p>No packages available at the moment</p>
          </div>
        ) : (
          packagesData.map((p) => (
            <div className="package-card" key={p._id}>
              <img 
                src={`${API_URL}${p.image}`} 
                alt={p.title} 
                className="package-img"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg'; // Fallback image
                }}
              />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <Link to={`/${p.packageId}`}>
                <button className="pkg-btn">View Details</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Packages;