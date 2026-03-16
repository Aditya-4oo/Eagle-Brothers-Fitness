import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Activity, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Star, 
  Heart, 
  MapPin, 
  Calculator 
} from 'lucide-react';
import './HomeDashboard.css';

const HomeDashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: 'Events', icon: <CalendarDays size={32} />, path: '/events', color: 'var(--royal-blue)' },
    { title: 'Football Coaching', icon: <Activity size={32} />, path: '/coaching/football', color: '#10B981' },
    { title: 'Athletics Coaching', icon: <GraduationCap size={32} />, path: '/coaching/athletics', color: '#F59E0B' },
    { title: 'Online Learning', icon: <BookOpen size={32} />, path: '/learning', color: '#3B82F6' },
    { title: 'Achievements', icon: <Award size={32} />, path: '/achievements', color: 'var(--golden-yellow)' },
    { title: 'Reviews', icon: <Star size={32} />, path: '/reviews', color: '#8B5CF6' },
    { title: 'Donations', icon: <Heart size={32} />, path: '/donations', color: '#EF4444' },
    { title: 'Run Tracker', icon: <MapPin size={32} />, path: '/tracker', color: '#14B8A6' },
    { title: 'BMI Calculator', icon: <Calculator size={32} />, path: '/bmi', color: '#EC4899' },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <h2>Welcome Athlete!</h2>
        <p>Your sports journey starts here.</p>
      </header>

      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <div 
            key={index} 
            className="dashboard-card card"
            onClick={() => navigate(item.path)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="card-icon-wrapper" style={{ color: item.color }}>
              {item.icon}
            </div>
            <h3 className="card-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;
