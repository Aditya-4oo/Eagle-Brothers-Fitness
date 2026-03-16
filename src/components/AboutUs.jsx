import React from 'react';
import { Target, Users, BookOpen, Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container animate-fade-in">
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="about-title">Eagle Brothers</h1>
        <p className="about-subtitle">Empowering Young Athletes</p>
        <div className="hero-shape"></div>
      </section>

      {/* Intro Section */}
      <section className="about-section card animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="section-header">
          <Users className="section-icon" />
          <h2>Who We Are</h2>
        </div>
        <p>
          <strong>Eagle Brothers</strong> is a youth-driven NGO and sports academy founded by 
          <strong> Aditya Ojha</strong> and <strong>Mohit Pandey</strong>. The organization aims to provide guidance, 
          professional coaching, and opportunities for young athletes who want to pursue sports but lack access to structured training.
        </p>
        <p>
          Both founders understand the difficulties faced by young athletes, such as lack of mentorship, financial limitations, and absence of proper sports infrastructure.
        </p>
      </section>

      {/* Founders Section */}
      <section className="about-section bg-transparent">
        <h2 className="text-center mb-4">Meet The Founders</h2>
        
        <div className="founder-grid">
          <div className="founder-card card animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="founder-avatar bg-blue">
              <span>AO</span>
            </div>
            <h3>Aditya Ojha</h3>
            <p className="founder-role">District & State-level Athlete</p>
            <p className="founder-bio">
              A 400-meter athletics champion who has won multiple medals. His experience in competitive sports allows him to teach effective training methods, discipline, and performance improvement strategies.
            </p>
          </div>

          <div className="founder-card card animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="founder-avatar bg-yellow">
              <span>MP</span>
            </div>
            <h3>Mohit Pandey</h3>
            <p className="founder-role">State-level Football Player</p>
            <p className="founder-bio">
              A highly skilled player with strong technical and tactical understanding. His coaching approach focuses on teamwork, game intelligence, and confidence on the field.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="about-section card animate-fade-in" style={{animationDelay: '0.4s'}}>
        <div className="section-header">
          <Target className="section-icon" style={{color: 'var(--golden-yellow)'}} />
          <h2>Our Vision</h2>
        </div>
        <p className="vision-text">
          "To empower talented students who want to build a future in sports but lack proper support and direction."
        </p>
        
        <div className="divider"></div>

        <div className="section-header mt-4">
          <BookOpen className="section-icon" style={{color: 'var(--royal-blue)'}} />
          <h2>Our Mission</h2>
        </div>
        <ul className="mission-list">
          <li>
            <ShieldCheck className="list-icon" />
            <span>Providing structured professional coaching</span>
          </li>
          <li>
            <HeartHandshake className="list-icon" />
            <span>Promoting discipline and physical fitness</span>
          </li>
          <li>
            <Star className="list-icon" />
            <span>Developing athletes capable of competing at state and national levels</span>
          </li>
          <li>
            <Users className="list-icon" />
            <span>Supporting underprivileged sports talent</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
