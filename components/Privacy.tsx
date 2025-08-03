import React from 'react';

const Privacy = () => {
  return (
    <section style={{
      background: '#f8f6f3',
      padding: '60px 30px', 
      fontFamily: 'Georgia, serif',
      color: '#333',
      maxWidth: '1100px',
      margin: '0 auto',
      lineHeight: 1.7,
      borderRadius: '12px'
    }}>
      <h1 style={{
        fontSize: '2.4em',
        color: '#8B6F47',
        marginBottom: '25px',
        fontWeight: 'normal'
      }}>
        Privacy Policy
      </h1>

      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        Your privacy is important to us. This Privacy Policy explains how Nuvinty collects, uses, and protects your personal data when you visit or use our website.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        1. Information We Collect
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        We may collect personal information including your name, email address, and any other details you provide through your account.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        2. How We Use Your Information
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        We use your information to provide services, process transactions, send updates, improve our website, and personalize your shopping experience.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        3. Sharing Your Information
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        We do not sell your personal data. We may share your information with trusted third parties to fulfill orders, deliver marketing communications, or comply with legal obligations.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        4. Cookies & Analytics
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        We use cookies to enhance your experience and analyze website traffic.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        5. Data Security
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        We implement security measures to protect your information. However, no method of transmission over the Internet is 100% secure.
      </p>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        6. Your Rights
      </h2>
      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        You have the right to access, correct, or delete your personal information. Please contact us at{' '}
        <a href="mailto:privacy@nuvinty.com" style={{ color: '#8B6F47' }}>
          privacy@nuvinty.com
        </a>{' '}
        with any requests.
      </p>

      <p style={{
        fontSize: '1em',
        marginTop: '40px',
        fontWeight: 'bold',
        color: '#444'
      }}>
        Last updated: July 2025
      </p>
    </section>
  );
};

export default Privacy;
