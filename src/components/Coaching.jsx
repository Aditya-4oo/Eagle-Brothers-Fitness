import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, GraduationCap, CheckCircle2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Coaching.css';

const COACHING_PROGRAMS = {
  football: {
    title: 'Football Academy',
    icon: <Activity size={32} />,
    color: '#10B981', /* Green */
    description: 'Professional football coaching for all age groups focusing on technical skills, tactical understanding, and physical fitness.',
    bgImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800',
    fields: [
      { label: 'Playing Position', options: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Not Sure'] },
      { label: 'Experience Level', options: ['Beginner', 'Intermediate', 'Advanced', 'Academy Level'] }
    ]
  },
  athletics: {
    title: 'Athletics Training',
    icon: <GraduationCap size={32} />,
    color: '#F59E0B', /* Amber/Yellow for track */
    description: 'Specialized track and field athletics coaching. Focus on sprints, middle distance, and field events for peak performance.',
    bgImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    fields: [
      { label: 'Event Type', options: ['Sprints (100m-400m)', 'Middle/Long Distance', 'Jumps', 'Throws', 'Multi-Events'] },
      { label: 'Experience Level', options: ['Beginner', 'School Level', 'District/State Level', 'National Level'] }
    ]
  }
};

const Coaching = () => {
  const { sport } = useParams();
  const navigate = useNavigate();
  const program = COACHING_PROGRAMS[sport];
  
  const [formData, setFormData] = useState({
    name: '', age: '', phone: '', email: '', 
    field1: program?.fields[0].options[0] || '',
    field2: program?.fields[1].options[0] || ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // If invalid sport parameter, just default to football or show error
  if (!program) return <div className="p-4 text-center mt-8">Program not found</div>;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    
    try {
      if (sport === 'football') {
        await axios.post('/api/registrations/football', {
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          email: formData.email,
          playingPosition: formData.field1,
          experienceLevel: formData.field2
        });
      } else if (sport === 'athletics') {
        await axios.post('/api/registrations/athletics', {
          name: formData.name,
          age: formData.age,
          phone: formData.phone,
          email: formData.email,
          eventType: formData.field1,
          achievements: formData.field2
        });
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="coaching-container animate-fade-in">
      <div 
        className="coaching-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${program.bgImage})` }}
      >
        <button className="icon-btn-back" onClick={() => navigate('/home')}>
           <ArrowLeft size={24} color="white" />
        </button>
        <div className="hero-icon-wrapper" style={{ backgroundColor: program.color }}>
          {program.icon}
        </div>
        <h1 className="coaching-title">{program.title}</h1>
        <p className="coaching-description">{program.description}</p>
      </div>

      <div className="coaching-content">
        {isSubmitted ? (
             <div className="success-state text-center py-8 card animate-fade-in">
               <CheckCircle2 size={64} style={{ color: program.color }} className="mx-auto mb-4" />
               <h3>Enrollment Successful!</h3>
               <p>Welcome to the {program.title}. One of our coaches will contact you shortly regarding the schedule.</p>
               <button className="btn-primary mt-4" onClick={() => navigate('/dashboard')}>
                 Go to Dashboard
               </button>
             </div>
        ) : (
          <div className="coaching-form-card card animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="form-header mb-4 border-b pb-4">
              <h3>Student Registration</h3>
              <p className="text-sm text-secondary">Please fill in the details below to join the coaching program.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" name="name" className="input-field" required 
                  value={formData.name} onChange={handleInputChange} 
                  placeholder="Athlete Name" 
                />
              </div>

              <div className="form-row">
                <div className="input-group flex-1">
                  <label className="input-label">Age</label>
                  <input 
                    type="number" name="age" className="input-field" required min="5" max="25" 
                    value={formData.age} onChange={handleInputChange} placeholder="14" 
                  />
                </div>
                <div className="input-group flex-1">
                  <label className="input-label">Phone</label>
                  <input 
                    type="tel" name="phone" className="input-field" required 
                    value={formData.phone} onChange={handleInputChange} placeholder="Mobile Number" 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email</label>
                <input 
                  type="email" name="email" className="input-field" required 
                  value={formData.email} onChange={handleInputChange} placeholder="Email for updates" 
                />
              </div>

              {/* Dynamic Fields based on Sport */}
              {program.fields.map((field, idx) => (
                <div className="input-group" key={idx}>
                  <label className="input-label">{field.label}</label>
                  <select 
                    name={`field${idx + 1}`} 
                    className="input-field custom-select" 
                    value={formData[`field${idx + 1}`]} 
                    onChange={handleInputChange}
                  >
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}

              <button 
                type="submit" 
                className="btn-primary w-full mt-4" 
                style={{ backgroundColor: program.color, color: 'white' }}
                disabled={isAnimating}
              >
                {isAnimating ? 'Processing...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coaching;
