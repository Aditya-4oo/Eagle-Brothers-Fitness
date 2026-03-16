import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Bell, Shield, Smartphone, ChevronRight, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in pb-8">
      <div className="learning-header mb-6">
        <button className="back-btn mb-2" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Settings</h2>
        <p>Manage your app preferences</p>
      </div>

      {isAdmin && (
        <div className="card mb-4" style={{ borderColor: 'var(--golden-yellow)', borderWidth: '1px', borderStyle: 'solid' }}>
          <h3 className="mb-4 text-golden-yellow">Administration</h3>
          <div className="menu-list">
            <div className="menu-item" onClick={() => navigate('/admin')}>
              <div className="menu-item-left">
                <div className="menu-icon-wrapper" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                  <Database size={18} className="text-golden-yellow" />
                </div>
                <div className="menu-text">
                  <h4>Admin Control Panel</h4>
                  <p>Manage users, events, and registrations</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-secondary" />
            </div>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <h3 className="mb-4">App Preferences</h3>
        
        <div className="menu-list">
          <div className="menu-item border-b" onClick={toggleTheme}>
            <div className="menu-item-left">
              <div className="menu-icon-wrapper bg-light-blue">
                {theme === 'dark' ? <Moon size={18} className="text-blue" /> : <Sun size={18} className="text-blue" />}
              </div>
              <div className="menu-text">
                <h4>Theme Mode</h4>
                <p>Currently using {theme} mode</p>
              </div>
            </div>
            <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}>
               {/* Pure CSS visual toggle */}
               <div className="toggle-knob"></div>
            </div>
          </div>

          <div className="menu-item pt-4">
            <div className="menu-item-left">
              <div className="menu-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <Bell size={18} className="text-yellow" />
              </div>
              <div className="menu-text">
                <h4>Push Notifications</h4>
                <p>Event reminders and coaching updates</p>
              </div>
            </div>
            <div className="toggle-switch active">
               <div className="toggle-knob"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">About the App</h3>
        <div className="menu-list">
          <div className="menu-item border-b">
            <div className="menu-item-left">
              <div className="menu-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Shield size={18} className="text-green" />
              </div>
              <div className="menu-text">
                <h4>Privacy Policy</h4>
                <p>How we protect your data</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-secondary" />
          </div>
          
          <div className="menu-item pt-4">
            <div className="menu-item-left">
              <div className="menu-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <Smartphone size={18} style={{ color: '#8B5CF6' }} />
              </div>
              <div className="menu-text">
                <h4>App Version</h4>
                <p>Eagle Brothers v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .toggle-switch {
          width: 44px;
          height: 24px;
          background-color: var(--border-color);
          border-radius: 12px;
          position: relative;
          transition: background-color 0.3s;
        }
        .toggle-switch.active {
          background-color: var(--royal-blue);
        }
        [data-theme='dark'] .toggle-switch.active {
          background-color: var(--golden-yellow);
        }
        .toggle-knob {
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-switch.active .toggle-knob {
          transform: translateX(20px);
        }
        .border-b { border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .pb-8 { padding-bottom: 2rem; }
      `}</style>
    </div>
  );
};

export default Settings;
