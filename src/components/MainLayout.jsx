import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally alert or ask confirmation
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="main-layout">
      {/* Top Header Placeholder (optional based on designs) */}
      <header className="main-header">
        <div className="header-logo">
          Eagle Brothers
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="content-scroll-area">
        <Outlet />
      </div>

      {/* Persistent Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink 
          to="/home" 
          className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
        >
          <Home size={24} className="nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
        >
          <LayoutDashboard size={24} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
        >
          <User size={24} className="nav-icon" />
          <span>Profile</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}
        >
          <Settings size={24} className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;
