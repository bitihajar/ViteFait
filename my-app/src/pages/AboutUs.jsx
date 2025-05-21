import React from 'react';
import '../app.css';

function AboutUs() {
  return (
    <div className="container">
      <h2 className="brand-header">About ViteFait</h2>
      <div className="content-card">
        <section className="about-section">
          <h3>Our Mission</h3>
          <p>
            At ViteFait, we're committed to helping shoppers make smart decisions by providing 
            real-time price comparisons across multiple platforms. Our goal is to save you both 
            time and money by bringing the best deals right to your fingertips.
          </p>
        </section>

        <section className="about-section">
          <h3>What We Do</h3>
          <p>
            We aggregate prices from various online retailers, allowing you to:
          </p>
          <ul>
            <li>Compare prices instantly</li>
            <li>Track your favorite items</li>
            <li>Find the best deals</li>
            <li>Make informed purchasing decisions</li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Why Choose ViteFait</h3>
          <p>
            Our platform is designed with user experience in mind, offering:
          </p>
          <ul>
            <li>Real-time price updates</li>
            <li>User-friendly interface</li>
            <li>Secure account management</li>
            <li>Personalized favorites list</li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Contact Us</h3>
          <p>
            Have questions or suggestions? We'd love to hear from you!<br />
            Email: contact@vitefait.com<br />
            Follow us on social media for the latest updates and deals.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs; 