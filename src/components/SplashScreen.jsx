import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Attempt to play eagle sound
    const audio = new Audio('https://orangefreesounds.com/wp-content/uploads/2016/10/Eagle-screech-sound-effect.mp3');
    // Mute or setup might be required for some browsers to allow autoplay,
    // but we will try playing it and catching errors if user has not interacted.
    audio.play().catch(e => console.log('Autoplay prevented by browser:', e));

    // Wait 3 seconds, then trigger exit animation
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // After exit animation finishes (3.5s total), navigate to login
    const navTimer = setTimeout(() => {
      navigate('/login');
    }, 3500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-container ${isExiting ? 'splash-exit' : ''}`}>
      {/* Subtle spotlight effect */}
      <div className="spotlight"></div>
      
      {/* Flowing sports energy particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}></div>
        ))}
      </div>

      <div className="splash-content">
        <h1 className="splash-title">
          <span>Eagle</span> Brothers
        </h1>
        
        {/* Animated Flying Eagle SVG */}
        <div className="eagle-wrapper">
          <svg
            className="eagle-svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Eagle Body */}
            <path
              d="M50 40 Q 60 45, 70 40 Q 60 55, 45 50 Q 30 55, 50 40"
              fill="var(--golden-yellow)"
            />
            {/* Eagle Head */}
            <circle cx="70" cy="38" r="4" fill="#E2E8F0" />
            <path d="M73 38 L 78 40 L 72 41 Z" fill="#EF4444" />
            {/* Wings (animated in CSS) */}
            <path
              className="wing wing-top"
              d="M45 45 Q 30 20, 10 30 Q 25 35, 45 45"
              fill="var(--golden-yellow)"
            />
            <path
              className="wing wing-bottom"
              d="M45 45 Q 30 70, 10 60 Q 25 55, 45 45"
              fill="var(--golden-yellow)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
