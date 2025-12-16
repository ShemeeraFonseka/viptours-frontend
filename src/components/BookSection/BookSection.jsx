import React from 'react'
import './BookSection.css'

const BookSection = () => {
  return (
    <section className="book-section">
      <div className="book-overlay">
        <div className="book-content">
          <h2>Ready to Start Your Adventure?</h2>
          <p>
            Experience Sri Lanka like never before — from stunning beaches to ancient wonders.
            Your dream vacation is just one click away.
          </p>
          <button className="book-btn">Book Now</button>
        </div>
      </div>
    </section>
  )
}

export default BookSection
