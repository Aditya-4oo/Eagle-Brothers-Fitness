import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reusing the login css

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsAnimating(false);
      return;
    }

    const { success, error: authError } = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password
    );
    
    setIsAnimating(false);
    
    if (success) {
      navigate('/home');
    } else {
      setError(authError || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-background"></div>
      
      <div className="login-card card" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
              <circle cx="50" cy="50" r="45" fill="var(--royal-blue)" />
              <path d="M50 30 Q 65 35, 75 30 Q 65 50, 45 45 Q 25 50, 50 30" fill="var(--golden-yellow)" />
            </svg>
          </div>
          <h2>Join the Academy</h2>
          <p>Create your athlete account</p>
        </div>

        {error && (
          <div className="error-message animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="login-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                name="name"
                className="input-field pl-10" 
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="email" 
                name="email"
                className="input-field pl-10" 
                placeholder="athlete@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                name="phone"
                className="input-field pl-10" 
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                className="input-field pl-10 pr-10" 
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                className="input-field pl-10 pr-10" 
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-primary login-btn ${isAnimating ? 'btn-loading' : ''}`}
            disabled={isAnimating}
          >
            {isAnimating ? 'Creating Account...' : (
              <>
                Sign Up <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <button type="button" className="signup-link" onClick={() => navigate('/login')}>Login</button></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
