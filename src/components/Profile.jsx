import React, { useState, useEffect } from 'react';
import { User, Settings, Edit3, Award, Calendar, Activity, MapPin, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    events: 0,
    distance: 0,
    bmi: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let eventsCount = 0;
        let totalDistance = 0;

        // Fetch user's registered events
        try {
          const eventsRes = await axios.get('/api/registrations/my-events');
          eventsCount = eventsRes.data.length;
        } catch (e) {
          console.error("Could not fetch my events", e);
        }

        // Fetch user's runs
        try {
          const runsRes = await axios.get('/api/runs');
          totalDistance = runsRes.data.reduce((sum, run) => sum + (run.distance || 0), 0);
        } catch (e) {
          console.error("Could not fetch runs", e);
        }

        // Get BMI from local storage
        const savedBmi = localStorage.getItem('user_bmi');

        setStats({
          events: eventsCount,
          distance: totalDistance.toFixed(1),
          bmi: savedBmi
        });

      } catch (error) {
        console.error('Error fetching profile stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const joinMonthYear = new Date(user.registrationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header-bg"></div>

      <div className="profile-main-card card">
        <div className="profile-avatar-wrapper">
          <img src="https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=200" alt="Profile" className="profile-avatar-img" />
          <button className="edit-avatar-btn">
            <Edit3 size={14} />
          </button>
        </div>
        
        <div className="profile-info-center">
          <h2>{user.name}</h2>
          <p className="text-secondary">{user.email}</p>
          <div className="profile-badge mt-2">
            <Award size={14} /> Member since {joinMonthYear}
          </div>
        </div>

        {/* Only show stats grid if at least one stat exists */}
        {(stats.events > 0 || stats.distance > 0 || stats.bmi) && (
          <div className="profile-stats-grid mt-6">
            {stats.events > 0 && (
              <div className="profile-stat-box">
                <Calendar size={20} className="stat-icon text-blue" />
                <span className="stat-value">{stats.events}</span>
                <span className="stat-label">Events</span>
              </div>
            )}
            
            {stats.distance > 0 && (
              <div className="profile-stat-box">
                <MapPin size={20} className="stat-icon text-green" />
                <span className="stat-value">{stats.distance} km</span>
                <span className="stat-label">Run Distance</span>
              </div>
            )}
            
            {stats.bmi && (
              <div className="profile-stat-box">
                <Activity size={20} className="stat-icon text-yellow" />
                <span className="stat-value">{stats.bmi}</span>
                <span className="stat-label">Current BMI</span>
              </div>
            )}
          </div>
        )}
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
              <input type="text" className="input-field" defaultValue={user.name} />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field disabled" disabled defaultValue={user.email} />
            </div>
            <button className="btn-primary w-full mt-2" onClick={() => setIsEditing(false)}>Close</button>
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

