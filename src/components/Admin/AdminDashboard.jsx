import React, { useState, useEffect } from 'react';
import { Shield, Plus, Calendar as CalendarIcon, Users, Activity, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState({
      event: [],
      football: [],
      athletics: []
  });

  // Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [eventData, setEventData] = useState({
    title: '', date: '', location: '', description: '', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800'
  });

  // Declarations moved above useEffect to prevent TDZ ReferenceErrors

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('/api/events');
      setEvents(data);
    } catch (e) { toast.error("Failed to load events"); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  const fetchRegistrations = async () => {
      try {
          const [evResp, fbResp, athResp] = await Promise.all([
              axios.get('/api/admin/registrations/event'),
              axios.get('/api/admin/registrations/football'),
              axios.get('/api/admin/registrations/athletics')
          ]);
          setRegistrations({
              event: evResp.data,
              football: fbResp.data,
              athletics: athResp.data
          });
      } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchRegistrations();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/events/${editingId}`, eventData);
        toast.success("Event updated!");
      } else {
        await axios.post('/api/events', eventData);
        toast.success("Event created!");
      }
      setShowEventForm(false);
      setEditingId(null);
      setEventData({ title: '', date: '', location: '', description: '', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800' });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving event");
    }
  };

  const editEvent = (evt) => {
      setEventData(evt);
      setEditingId(evt.id);
      setShowEventForm(true);
  };

  const deleteEvent = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (e) { toast.error("Failed to delete"); }
  };

  return (
    <div className="admin-container animate-fade-in pb-24">
      <div className="admin-header">
        <Shield size={32} className="text-golden-yellow" />
        <h1>Admin Control Panel</h1>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
          <CalendarIcon size={18} /> Events
        </button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <Users size={18} /> Users
        </button>
        <button className={`admin-tab ${activeTab === 'registrations' ? 'active' : ''}`} onClick={() => setActiveTab('registrations')}>
          <Activity size={18} /> Reg
        </button>
      </div>

      <div className="admin-content">
        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h2>Manage Events</h2>
              <button className="btn-primary sm-btn" onClick={() => { setShowEventForm(!showEventForm); setEditingId(null); }}>
                <Plus size={16} /> Add Event
              </button>
            </div>

            {showEventForm && (
              <form className="admin-form card" onSubmit={handleEventSubmit}>
                <input type="text" placeholder="Event Title" className="input-field" required
                  value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} />
                
                <input type="date" className="input-field" required
                  value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} />
                
                <input type="text" placeholder="Location" className="input-field" required
                  value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                
                <textarea placeholder="Description" className="input-field textarea" required
                  value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
                
                <input type="text" placeholder="Image URL (optional)" className="input-field"
                  value={eventData.image} onChange={e => setEventData({...eventData, image: e.target.value})} />
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEventForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Event</button>
                </div>
              </form>
            )}

            <div className="item-list">
              {events.length === 0 ? <p className="empty-state">No events found.</p> : events.map(evt => (
                <div key={evt.id} className="admin-item card">
                  <div className="item-info">
                    <h4>{evt.title}</h4>
                    <p>{new Date(evt.date).toLocaleDateString()} - {evt.location}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => editEvent(evt)} className="icon-btn edit"><Edit size={18} /></button>
                    <button onClick={() => deleteEvent(evt.id)} className="icon-btn delete"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="tab-pane">
            <h2>Registered Users ({users.length})</h2>
            <div className="users-table-container card">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                      <td>{new Date(u.registrationDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <div className="tab-pane">
            <h2>Registrations Overview</h2>
            
            <h3 className="sub-heading mt-4">Event Registrations</h3>
            <div className="card p-4">
              {registrations.event.length === 0 ? <p>No event registrations yet.</p> :
                  registrations.event.map(r => (
                      <div key={r.id} className="border-b border-gray-700 py-2 last:border-0">
                          <p className="font-bold">{r.name} ({r.age}y)</p>
                          <p className="text-sm text-gray-400">Event: {r.eventTitle}</p>
                      </div>
                  ))
              }
            </div>

            <h3 className="sub-heading mt-4">Football Academy</h3>
            <div className="card p-4">
              {registrations.football.length === 0 ? <p>No football registrations yet.</p> :
                  registrations.football.map(r => (
                      <div key={r.id} className="border-b border-gray-700 py-2 last:border-0">
                          <p className="font-bold">{r.name} - {r.playingPosition}</p>
                          <p className="text-sm text-gray-400">Exp: {r.experienceLevel} | Contact: {r.phone}</p>
                      </div>
                  ))
              }
            </div>

            <h3 className="sub-heading mt-4">Athletics Coaching</h3>
            <div className="card p-4">
              {registrations.athletics.length === 0 ? <p>No athletics registrations yet.</p> :
                  registrations.athletics.map(r => (
                      <div key={r.id} className="border-b border-gray-700 py-2 last:border-0">
                          <p className="font-bold">{r.name} - {r.eventType}</p>
                          <p className="text-sm text-gray-400">Achievements: {r.achievements}</p>
                      </div>
                  ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
