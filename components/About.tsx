import React from 'react';

const About: React.FC = () => {
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
        About Us
      </h1>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Access the global market of pre-loved & conscious new luxury and designer fashion, with over 100k listings and we are just getting started.
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        What is good about us? We're not only helping you access a global network of pre-loved luxury fashion, we also created a{' '}
        <strong>Nuvinty index</strong>, helping you find new items where brands have taken steps to create with being good for our planet - as well as your wardrobe.
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Nuvinty was founded in 2025 by Daniel Kelly. Have any comments or suggestions? Please email us at{' '}
        <a
          href="mailto:hello@nuvinty.com"
          style={{ color: '#8B6F47', textDecoration: 'none' }}
        >
          hello@nuvinty.com
        </a>
        .
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          margin: '50px 0'
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            fontSize: '1em'
          }}
        >
          <strong style={{ fontSize: '1.5em' }}>
            200+
          </strong>
          <br />
          Luxury Brands
        </div>
        <div
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            fontSize: '1em'
          }}
        >
          <strong style={{ fontSize: '1.5em' }}>
            100K+
          </strong>
          <br />
          Products
        </div>
        <div
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px 30px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            fontSize: '1em'
          }}
        >
          <strong style={{ fontSize: '1.5em' }}>
            4.9★
          </strong>
        </div>
      </div>

      <h2
        style={{
          fontSize: '2em',
          color: '#8B6F47',
          marginTop: '60px',
          marginBottom: '20px',
          fontWeight: 'normal'
        }}
      >
        Our Values
      </h2>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Conscious luxury.
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        By promoting pre-owned luxury fashion and new items from retailers that are doing their part, we contribute to a more sustainable and circular fashion economy and less about fast empty fashion.
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Global Community
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        You're building bridges between conscious consumers worldwide, creating a community where luxury fashion lovers can discover, share, and celebrate sustainable style choices together, regardless of geography.
      </p>

      <h2
        style={{
          fontSize: '2em',
          color: '#8B6F47',
          marginTop: '60px',
          marginBottom: '20px',
          fontWeight: 'normal'
        }}
      >
        Meet the Team
      </h2>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Daniel Kelly
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        <em>Founder and CEO</em>
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        Daniel founded Nuvinty in 2025 to create the world's premier destination for conscious luxury fashion. Daniel recognized that luxury fashion consumers lack a trusted way to shop consciously across the fragmented marketplace and built a global platform that aggregates the finest new and pre-owned luxury items from top brands.
      </p>

      <h2
        style={{
          fontSize: '2em',
          color: '#8B6F47',
          marginTop: '60px',
          marginBottom: '20px',
          fontWeight: 'normal'
        }}
      >
        Our Mission
      </h2>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        To make luxury fashion accessible, authentic, and sustainable for fashion enthusiasts worldwide. We believe everyone deserves to express their unique style through exceptional pieces that tell a story.
      </p>

      <p
        style={{
          fontSize: '1em',
          marginBottom: '18px',
          color: '#444'
        }}
      >
        <strong>Join us in redefining luxury fashion.</strong>
      </p>
    </section>
  );
};

export default About;
 