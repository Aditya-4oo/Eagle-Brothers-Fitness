import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');

    const { success, error: authError } = await login(email, password);
    
    setIsAnimating(false);
    
    if (success) {
      navigate('/home');
    } else {
      setError(authError || 'Please enter valid credentials.');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-background"></div>
      
      <div className="login-card card">
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
              {/* Static Eagle Logo Version */}
              <circle cx="50" cy="50" r="45" fill="var(--royal-blue)" />
              <path d="M50 30 Q 65 35, 75 30 Q 65 50, 45 45 Q 25 50, 50 30" fill="var(--golden-yellow)" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Login to access your sports dashboard</p>
        </div>

        {error && (
          <div className="error-message animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="email" 
                className="input-field pl-10" 
                placeholder="athlete@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label className="input-label">Password</label>
              <button type="button" className="forgot-password">Forgot Password?</button>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field pl-10 pr-10" 
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <button 
            type="submit" 
            className={`btn-primary login-btn ${isAnimating ? 'btn-loading' : ''}`}
            disabled={isAnimating}
          >
            {isAnimating ? 'Authenticating...' : (
              <>
                Let's Go <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <button type="button" className="signup-link" onClick={() => navigate('/signup')}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
