import React, { useState } from 'react';
import { User, Settings, Edit3, Award, Calendar, Activity, MapPin, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const MOCK_USER = {
  name: 'Athlete Profile',
  email: 'athlete@eaglebrothers.org',
  joinDate: 'Jan 2024',
  level: 'Intermediate',
  avatar: 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200',
  stats: {
    events: 4,
    distance: '145 km',
    bmi: '22.4'
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header-bg"></div>

      <div className="profile-main-card card">
        <div className="profile-avatar-wrapper">
          <img src={MOCK_USER.avatar} alt="Profile" className="profile-avatar-img" />
          <button className="edit-avatar-btn">
            <Edit3 size={14} />
          </button>
        </div>
        
        <div className="profile-info-center">
          <h2>{MOCK_USER.name}</h2>
          <p className="text-secondary">{MOCK_USER.email}</p>
          <div className="profile-badge mt-2">
            <Award size={14} /> {MOCK_USER.level} Member
          </div>
        </div>

        <div className="profile-stats-grid mt-6">
          <div className="profile-stat-box">
            <Calendar size={20} className="stat-icon text-blue" />
            <span className="stat-value">{MOCK_USER.stats.events}</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="profile-stat-box">
            <MapPin size={20} className="stat-icon text-green" />
            <span className="stat-value">{MOCK_USER.stats.distance}</span>
            <span className="stat-label">Run Distance</span>
          </div>
          <div className="profile-stat-box">
            <Activity size={20} className="stat-icon text-yellow" />
            <span className="stat-value">{MOCK_USER.stats.bmi}</span>
            <span className="stat-label">Current BMI</span>
          </div>
        </div>
      </div>

      <div className="profile-menu mt-6">
        <h3 className="mb-4">Account</h3>
        
        <div className="menu-list card">
          <div className="menu-item" onClick={() => navigate('/settings')}>
            <div className="menu-item-left">
              <div className="menu-icon-wrapper bg-light-blue">
                <Settings size={18} className="text-blue" />
              </div>
              <div className="menu-text">
                <h4>Settings & Preferences</h4>
                <p>App theme, notifications, security</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-secondary" />
          </div>

          <div className="menu-divider"></div>

          <div className="menu-item" onClick={() => setIsEditing(!isEditing)}>
            <div className="menu-item-left">
              <div className="menu-icon-wrapper bg-light-green">
                <User size={18} className="text-green" />
              </div>
              <div className="menu-text">
                <h4>Edit Profile Details</h4>
                <p>Update personal information</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-secondary" />
          </div>
        </div>

        {isEditing && (
          <div className="card mt-4 animate-fade-in edit-profile-form">
            <h4 className="mb-4">Personal Information</h4>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" defaultValue={MOCK_USER.name} />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field disabled" disabled defaultValue={MOCK_USER.email} />
            </div>
            <button className="btn-primary w-full mt-2" onClick={() => setIsEditing(false)}>Save Changes</button>
          </div>
        )}

        <button className="logout-action-btn mt-6" onClick={handleLogout}>
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
