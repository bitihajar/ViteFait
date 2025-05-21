import React, { useState } from 'react';
import '../app.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      showNotification('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      showNotification(err.message || 'Failed to send message', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2 className="brand-header">Contact Us</h2>
      <div className="content-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="auth-input"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="auth-input"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="auth-input"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="auth-input"
              rows="5"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {notification && (
        <div className="notification-overlay">
          <div className={`notification-popup ${notification.isError ? 'error' : ''}`}>
            <p>{notification.message}</p>
            <button 
              onClick={() => setNotification(null)} 
              className="notification-button"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact; 