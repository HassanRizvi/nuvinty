import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <section 
      style={{
        background: '#f8f6f3',
        padding: '60px 30px',
        fontFamily: 'Georgia, serif',
        color: '#333',
        maxWidth: '1100px',
        margin: '0 auto',
        lineHeight: '1.7',
        borderRadius: '12px'
      }}
    >
      <h1 
        style={{
          fontSize: '2.4em',
          color: '#8B6F47',
          marginBottom: '25px',
          fontWeight: 'normal'
        }}
      >
        Contact Us
      </h1>
      
      <p 
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        We're here to help. Whether you have questions about our site, or just want to say hello — we'd love to hear from you.
      </p>

      <h2 
        style={{
          fontSize: '2em',
          color: '#8B6F47',
          marginTop: '40px',
          marginBottom: '15px'
        }}
      >
        General Inquiries
      </h2>
      
      <p 
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        For general questions or feedback, reach out to us at:{' '}
        <a 
          href="mailto:hello@nuvinty.com" 
          style={{ color: '#8B6F47' }}
        >
          hello@nuvinty.com
        </a>
      </p>

      <p 
        style={{
          fontSize: '1em',
          marginTop: '40px',
          fontWeight: 'bold',
          color: '#444'
        }}
      >
        Our team aims to respond within 1–2 business days.
      </p>
    </section>
  );
};

export default ContactUs; 