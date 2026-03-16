import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import './Achievements.css';

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800', alt: 'Football Tournament Win' },
  { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800', alt: 'State Athletics Meet' },
  { url: 'https://images.unsplash.com/photo-1518605368461-1ee7c6883211?auto=format&fit=crop&q=80&w=800', alt: 'Academy Training Session' },
  { url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800', alt: 'Trophy Celebration' }
];

const Achievements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="achievements-container animate-fade-in">
      <div className="learning-header">
        <h2>Activities & Achievements</h2>
        <p>A glimpse into our academy's proudest moments.</p>
      </div>

      {/* Main Image Slider */}
      <div className="slider-container card animate-fade-in">
        <div 
          className="slider-image-wrapper"
          style={{ backgroundImage: `url(${GALLERY_IMAGES[currentIndex].url})` }}
        >
          <div className="slider-overlay">
            <h3 className="slider-caption">{GALLERY_IMAGES[currentIndex].alt}</h3>
          </div>
          
          <button className="slider-btn prev-btn" onClick={prevSlide}>
            <ArrowLeft size={24} />
          </button>
          <button className="slider-btn next-btn" onClick={nextSlide}>
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="slider-thumbnails">
          {GALLERY_IMAGES.map((img, index) => (
            <div 
              key={index}
              className={`thumbnail-wrapper ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
        </div>
      </div>

      {/* Achievement List */}
      <div className="achievements-list mt-8">
        <h3 className="mb-4">Recent Milestones</h3>
        <ul className="timeline">
          <li className="timeline-item">
            <div className="timeline-marker bg-yellow"></div>
            <div className="timeline-content card animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h4>U-16 State Football Champions</h4>
              <p className="text-secondary text-sm">Our academy squad clinched the state title with an undefeated run.</p>
              <span className="timeline-date">September 2024</span>
            </div>
          </li>
          <li className="timeline-item">
            <div className="timeline-marker bg-blue"></div>
            <div className="timeline-content card animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h4>10+ Medals in District Athletics</h4>
              <p className="text-secondary text-sm">Our track athletes dominated the district meet, securing gold in 100m, 400m, and relay events.</p>
              <span className="timeline-date">August 2024</span>
            </div>
          </li>
          <li className="timeline-item">
            <div className="timeline-marker bg-green"></div>
            <div className="timeline-content card animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h4>Academy Expansion</h4>
              <p className="text-secondary text-sm">Opened a new synthetic turf and equipment facility to support 150+ underprivileged athletes.</p>
              <span className="timeline-date">June 2024</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Achievements;
