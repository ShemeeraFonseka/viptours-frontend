import "./Pa1.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Pa1 = () => {

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

  const scheduleData = [
    {
      day: "1. Sigiriya: The Eighth Wonder of the World",
      details: [
        "No trip to Sri Lanka is complete without climbing Sigiriya, the magnificent \"Lion Rock.\" This massive column of rock, rising 200 meters above the jungle, houses the ruins of an ancient fortress built by King Kasyapa in the 5th century. The climb rewards you with breathtaking panoramic views, ancient frescoes (the 'Sigiriya Maidens'), and the impressive \"Lion Gate\" paws at the entrance. It’s a testament to ancient Sri Lankan engineering and art."
      ]
    },
    {
      day: "2. Kandy: Home of the Sacred Tooth Reli",
      details: [
        "Nestled among the hills, Kandy is the last royal capital of Sri Lanka and a vibrant cultural hub. It is most famous for the Temple of the Sacred Tooth Relic (Sri Dalada Maligawa), which houses what is believed to be the tooth of the Buddha. The temple is a critical pilgrimage site, and its ceremonial rituals offer a glimpse into Sri Lanka's living Buddhist tradition. Don't miss the Kandy Lake and the surrounding lush botanical gardens."
      ]
    },
    {
      day: "3. Galle Fort: A Colonial Time Capsule",
      details: [
        "Heading south, the historic city of Galle boasts the beautifully preserved Galle Fort, a UNESCO World Heritage site built first by the Portuguese in the 16th century and extensively fortified by the Dutch. Walking the ramparts at sunset, exploring the narrow cobblestone streets, and discovering boutique shops, cafes, and museums makes Galle a perfect blend of history and modern charm. It feels like stepping into a different era."
      ]
    }
  ];

  const [openDay, setOpenDay] = useState(null);

  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };


  return (
    <div className="package-container">

      {/* Header */}
      <div className="package-header">
        <h1>The Pearl of the Indian Ocean: Unlocking Sri Lanka’s Ancient Heart</h1>

      </div>

      {/* Gallery */}
      <div className="package-gallery">
        <img src="/images/ab2.jpg" alt="Beach" />
        <img src="/images/slide2.jpg" alt="Temple" />
      </div>

      {/* Description */}
      <div className="package-description">
        <p>
          Sri Lanka, often called the Pearl of the Indian Ocean, offers an incredible blend of pristine beaches, lush green tea plantations, and deep historical roots. For first-time visitors, the Cultural Triangle is the definitive starting point—a journey through ancient kingdoms, stunning artistry, and UNESCO World Heritage Sites that tell the story of a civilization spanning over two millennia.
        </p>

      </div>


      {/* Schedule */}
      <div className="schedule-section">
        <h2>Tour Schedule</h2>
        <div className="schedule">

          {scheduleData.map((item, index) => (
            <div key={index} className="day-item">
              <p
                className="day-title"
                onClick={() => toggleDay(index)}
              >
                <strong>{item.day}</strong>
                <span className="toggle-icon">
                  {openDay === index ? "▲" : "▼"}
                </span>
              </p>

              {openDay === index && (
                <ul className="day-details">
                  {item.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <br />
          <h2>Pro Tip for Travelers:</h2>
          <p>Rent a bicycle in the ancient cities of Anuradhapura or Polonnaruwa to explore the vast, sprawling ruins of stupas and temples at your own pace. These sites offer a more tranquil, profound experience of Sri Lanka's ancient architectural prowess. Start your day early to beat the heat and catch the best light for photography.</p>

        </div>
      </div>


      <br />
      {/* Booking Form */}
      <div className="booking-section">
        <h2>Book Your Tour</h2>
        <p>Please fill out the form and we will contact you shortly.</p>

        <form className="booking-form">

          <div className="form-group">
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="E-mail" required />
          </div>

          <div className="form-group">
            <input type="text" placeholder="Phone" required />
            <input type="text" placeholder="Address" />
          </div>

          <div className="form-group">
            <input type="date" placeholder="Check-in" />
            <input type="date" placeholder="Check-out" />
          </div>

          <div className="form-group">
            <input type="number" placeholder="Adults" min="1" />
            <input type="number" placeholder="Children" min="0" />
          </div>

          <textarea placeholder="Your Message"></textarea>

          <button className="book-now-btn">Submit Booking</button>

        </form>
      </div>
      <br /><br />
      {/* Contact Section */}
      <div className="contact-section">
        <h2>Have Any Questions?</h2>
        <p>Sri Lanka travel, accommodations, or anything else? We're here to help!</p><br /><br />
        <p><strong>📞 {contactInfo.mobile || 'Loading...'}</strong></p><br />
        <p><strong>📧 {contactInfo.email || 'Loading...'}</strong></p>
      </div>


    </div>
  );
};

export default Pa1;
