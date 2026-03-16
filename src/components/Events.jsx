import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    sportType: 'General'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/events');
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
    setIsSubmitted(false);
    setFormData({ ...formData, sportType: event.title }); // default to event title
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/registrations/event', {
        eventId: selectedEvent.id,
        ...formData
      });
      setIsSubmitted(true);
      toast.success("Registration successful!");
      
      setTimeout(() => {
        setShowForm(false);
        setSelectedEvent(null);
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="events-container animate-fade-in">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        <p>Register and compete to showcase your talent.</p>
      </div>

      {!showForm ? (
        <div className="events-list">
          {loading ? (
            <p className="text-center text-gray-400">Loading events...</p>
          ) : events.length === 0 ? (
            <div className="empty-state card p-8 text-center">
              <p>No upcoming events at the moment. Check back later!</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div 
                key={event.id} 
                className="event-card card animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {event.image && (
                  <div 
                    className="event-image" 
                    style={{backgroundImage: `url(${event.image})`}}
                  >
                  </div>
                )}
                
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <Calendar size={16} /> <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    {/* Time is assumed to be part of the date or description for simplicity now */}
                    <div className="detail-item">
                      <MapPin size={16} /> <span>{event.location}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-primary w-full mt-4"
                    onClick={() => handleRegisterClick(event)}
                  >
                    Register Now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="registration-form-container card animate-fade-in">
          {isSubmitted ? (
            <div className="success-state text-center py-8">
              <CheckCircle2 size={64} className="text-success mx-auto mb-4" style={{color: 'var(--success-color)'}}/>
              <h3>Registration Successful!</h3>
              <p>You are officially registered for {selectedEvent.title}.</p>
            </div>
          ) : (
            <>
              <div className="form-header mb-4">
                <button 
                  className="back-btn" 
                  onClick={() => setShowForm(false)}
                >
                  ← Back to Events
                </button>
                <h3 className="mt-4">Register for {selectedEvent.title}</h3>
              </div>

              <form onSubmit={handleSubmit} className="event-registration-form">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" name="name" className="input-field" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
                
                <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                  <div className="input-group flex-1" style={{ flex: 1 }}>
                    <label className="input-label">Age</label>
                    <input type="number" name="age" className="input-field" required min="8" max="99" placeholder="16" value={formData.age} onChange={handleChange} style={{ width: '100%' }} />
                  </div>
                  <div className="input-group flex-1" style={{ flex: 1 }}>
                    <label className="input-label">Phone</label>
                    <input type="tel" name="phone" className="input-field" required placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="input-group mt-3">
                  <label className="input-label">Email Address</label>
                  <input type="email" name="email" className="input-field" required placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                </div>

                <button type="submit" className={`btn-primary w-full mt-4 ${isSubmitting ? 'btn-loading' : ''}`} disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
