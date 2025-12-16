import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PackageDetail.css';

const PackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    checkin: '',
    checkout: '',
    destination: '',
    price: '',
    adults: 1,
    children: 0,
    request: ''
  });

  useEffect(() => {
    fetchPackageDetail();
  }, [packageId]);

  const fetchPackageDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/vipapi/packages/${packageId}`);
      setPackageData(res.data);
      // Pre-fill destination with package title
      setBookingFormData(prev => ({
        ...prev,
        destination: res.data.title
      }));
    } catch (err) {
      console.error("❌ Error fetching package details:", err);
      setError('Package not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!bookingFormData.name || !bookingFormData.phone || !bookingFormData.email ||
        !bookingFormData.checkin || !bookingFormData.checkout) {
        alert('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate dates
      const checkinDate = new Date(bookingFormData.checkin);
      const checkoutDate = new Date(bookingFormData.checkout);

      if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date');
        setSubmitting(false);
        return;
      }

      // Send booking request
      const response = await axios.post(
        `${API_URL}/vipapi/bookings`,
        bookingFormData
      );

      alert(`✅ Booking created successfully! Booking ID: ${response.data.bookingID}`);

      // Reset form
      setBookingFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        checkin: '',
        checkout: '',
        price: '',
        destination: packageData.title,
        adults: 1,
        children: 0,
        request: ''
      });
    } catch (err) {
      console.error('❌ Error creating booking:', err);
      const errorMsg = err.response?.data?.error || 'Failed to create booking. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="package-detail-container">
        <div className="loading-spinner">
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="package-detail-container">
        <div className="error-message">
          <h2>Package Not Found</h2>
          <p>The package you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/packages')} className="back-btn">
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-container">
      {/* Hero Section */}
      <div className="package-hero">
        <img
          src={`${API_URL}/${packageData.image}`}
          alt={packageData.title}
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>{packageData.title}</h1>
          <p>{packageData.description}</p>

        </div>
      </div>

      {/* Main Content */}
      <div className="package-content">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back to Packages
        </button>

        {/* Detailed Introduction */}
        {packageData.detailedTitle && (
          <div className="detail-intro">
            <h2>{packageData.detailedTitle}</h2>
            {packageData.detailedIntro && (
              <p className="intro-text">{packageData.detailedIntro}</p>
            )}
          </div>
        )}

        {/* Sections */}
        {packageData.sections && packageData.sections.length > 0 && (
          <div className="detail-sections">
            {packageData.sections.map((section, index) => (
              <div key={index} className="detail-section">
                <h3>{section.sectionTitle}</h3>
                {section.sectionImage && (
                  <img
                    src={`${API_URL}/${section.sectionImage}`}
                    alt={section.sectionTitle}
                    className="section-image"
                  />
                )}
                <p className="section-content">{section.sectionContent}</p>

              </div>

            ))}
          </div>
        )}

        <div className="pro-tip">
          <h2>Rs. {packageData.price}.00</h2>


        </div>


        {/* Pro Tip */}
        {packageData.proTip && (
          <div className="pro-tip">

            <h3>💡 Pro Tip for Travelers:</h3>
            <p>{packageData.proTip}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="booking-section">
          <h2>Book Your Tour</h2>
          <p>Please fill out the form and we will contact you shortly.</p>

          <form className="booking-form" onSubmit={handleBookingSubmit}>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={bookingFormData.name}
                onChange={handleBookingInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail *"
                value={bookingFormData.email}
                onChange={handleBookingInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone *"
                value={bookingFormData.phone}
                onChange={handleBookingInputChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={bookingFormData.address}
                onChange={handleBookingInputChange}
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                name="checkin"
                placeholder="Check-in *"
                value={bookingFormData.checkin}
                onChange={handleBookingInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <input
                type="date"
                name="checkout"
                placeholder="Check-out *"
                value={bookingFormData.checkout}
                onChange={handleBookingInputChange}
                min={bookingFormData.checkin || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="adults"
                placeholder="Adults *"
                value={bookingFormData.adults}
                onChange={handleBookingInputChange}
                min="1"
                required
              />
              <input
                type="number"
                name="children"
                placeholder="Children"
                value={bookingFormData.children}
                onChange={handleBookingInputChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="destination"
                placeholder="Destination *"
                value={bookingFormData.destination}
                onChange={handleBookingInputChange}
                readOnly
              />
            </div>

            <textarea
              name="request"
              placeholder="Your Message / Special Requests"
              value={bookingFormData.request}
              onChange={handleBookingInputChange}
            />

            <button
              type="submit"
              className="book-now-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </button>

          </form>
        </div>

        <br /><br />

        {/* Call to Action */}
        <div className="detail-cta">
          <h3>Ready to Explore?</h3>
          <p>Contact us to customize this tour to your preferences</p>
          <button onClick={() => navigate('/contact')} className="contact-cta-btn">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;