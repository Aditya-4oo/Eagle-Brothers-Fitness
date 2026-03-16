import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/Admin/AdminDashboard';
import MainLayout from './components/MainLayout';
import HomeDashboard from './components/HomeDashboard';
import AboutUs from './components/AboutUs';
import Events from './components/Events';
import Coaching from './components/Coaching';
import Learning from './components/Learning';
import Achievements from './components/Achievements';
import Reviews from './components/Reviews';
import Donations from './components/Donations';
import RunTracker from './components/RunTracker';
import BMI from './components/BMI';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/home" replace />;
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <div className="app-wrapper animate-fade-in">
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Main Application Routes inside MainLayout Context */}
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/home" element={<HomeDashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/coaching/:sport" element={<Coaching />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/tracker" element={<RunTracker />} />
              <Route path="/bmi" element={<BMI />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Navigate to="/home" replace />} />
            </Route>
            
            <Route element={
              <ProtectedRoute requireAdmin={true}>
                <MainLayout />
              </ProtectedRoute>
            }>
               <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/splash" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
