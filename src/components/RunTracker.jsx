import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, MapPin, Activity, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './RunTracker.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const RunTracker = () => {
  const { token } = useAuth();
  
  const [isTracking, setIsTracking] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [distance, setDistance] = useState(0); // in km
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const timerRef = useRef(null);
  const watchIdRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchRunHistory();
    // Get initial position to center map
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Init geolocation error: ", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const fetchRunHistory = async () => {
    try {
      const { data } = await axios.get('/api/runs');
      setHistory(data);
    } catch(err) {
      console.error(err);
      toast.error('Failed to load run history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const min = Math.floor((totalSeconds % 3600) / 60);
    const sec = totalSeconds % 60;
    
    if (hours > 0) {
       return `${hours}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;    
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); 
  };

  const saveRun = async () => {
    if (distance < 0.01) {
       toast("Run too short to save.", { icon: "🏃" });
       return;
    }
    try {
      const runData = {
        distance: distance.toFixed(3),
        duration: time,
        pathData: routeCoordinates
      };
      await axios.post('/api/runs', runData);
      toast.success("Run saved successfully!");
      fetchRunHistory();
    } catch (e) {
      toast.error("Failed to save run");
    }
  };

  const handleStartStop = () => {
    if (isTracking) {
      // STOP RUN
      clearInterval(timerRef.current);
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      setIsTracking(false);
      
      saveRun();
    } else {
      // START RUN
      setIsTracking(true);
      setTime(0);
      setDistance(0);
      setRouteCoordinates([]);
      
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      if ("geolocation" in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const newCoord = [position.coords.latitude, position.coords.longitude];
            setCurrentPosition(newCoord);
            
            // Pan map to new coord
            if(mapRef.current) {
               mapRef.current.flyTo(newCoord, 16);
            }
            
            setRouteCoordinates((prev) => {
              if (prev.length > 0) {
                const lastCoord = prev[prev.length - 1];
                const deltaDist = calculateDistance(lastCoord[0], lastCoord[1], newCoord[0], newCoord[1]);
                
                // Add distance only if movement > 3 meters to ignore jitter
                if (deltaDist > 0.003) {
                   setDistance((d) => d + deltaDist);
                   return [...prev, newCoord];
                }
                return prev;
              }
              return [newCoord];
            });
          },
          (error) => toast.error("GPS Error: Ensure location permissions are granted."),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        toast.error("Geolocation not supported by this browser.");
      }
    }
  };


  return (
    <div className="tracker-container animate-fade-in pb-20">
      <div className="learning-header">
        <h2>Run Tracker</h2>
        <p>Record your runs and monitor your progress via GPS.</p>
      </div>

      <div className="tracker-card card mb-6 animate-fade-in">
        <div className="map-view" style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
          <div className={`gps-indicator z-[1000] absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 ${isTracking ? 'text-green-400' : ''}`}>
            <MapPin size={12} /> {isTracking ? 'Tracking Active' : 'GPS Ready'}
          </div>
          
          {currentPosition ? (
             <MapContainer 
                center={currentPosition} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                zoomControl={false}
             >
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />
               <Marker position={currentPosition}>
                  <Popup>You are here</Popup>
               </Marker>
               {routeCoordinates.length > 0 && (
                 <Polyline positions={routeCoordinates} color="var(--royal-blue)" weight={5} />
               )}
             </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                <Activity className="animate-pulse mb-2" size={32} />
                <span>Acquiring GPS Signal...</span>
            </div>
          )}
        </div>

        <div className="tracker-stats mt-4">
          <div className="stat-box">
            <span className="stat-label">Distance (km)</span>
            <span className="stat-value text-royal-blue">{distance.toFixed(2)}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Pace (min/km)</span>
            <span className="stat-value text-golden-yellow">
              {distance > 0 ? formatTime(Math.round(time / distance)) : '--:--'}
            </span>
          </div>
          <div className="stat-box time-box">
            <span className="stat-label">Duration</span>
            <span className="stat-value time-value">{formatTime(time)}</span>
          </div>
        </div>

        <div className="tracker-controls mt-6 pt-4 border-t border-gray-100">
          <button 
            className={`control-btn mx-auto flex items-center justify-center ${isTracking ? 'btn-stop bg-red-500 text-white' : 'btn-start bg-green-500 text-white'} w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-105`}
            onClick={handleStartStop}
            disabled={!currentPosition}
          >
            {isTracking ? <Square size={28} /> : <Play size={28} className="translate-x-[2px]" />}
          </button>
          <div className="text-center text-xs text-gray-500 mt-2">
             {isTracking ? 'Tap to Stop & Save' : 'Tap to Start Run'}
          </div>
        </div>
      </div>

      <div className="history-section animate-fade-in" style={{animationDelay: '0.2s'}}>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-lg"><Activity size={20} className="text-royal-blue" /> Run History</h3>
        
        {loading ? (
           <p className="text-sm text-gray-400">Loading history...</p>
        ) : history.length === 0 ? (
           <div className="card text-center p-6 text-gray-500">
             <MapPin size={32} className="mx-auto mb-2 opacity-50" />
             <p>No runs recorded yet.</p>
           </div>
        ) : (
          <div className="history-list flex flex-col gap-3">
            {history.map((run) => (
              <div key={run.id} className="history-card card flex justify-between items-center p-4">
                <div className="history-date text-sm font-medium">
                  <span className="block text-gray-400 text-xs mb-1 mb-1">{new Date(run.date).toLocaleDateString()}</span>
                  <span className="block">{new Date(run.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                
                <div className="history-details flex gap-6 text-right">
                  <div className="history-stat">
                    <h4 className="font-bold text-lg text-royal-blue">{run.distance} <span className="text-xs font-normal">km</span></h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Dist</span>
                  </div>
                  <div className="history-stat w-16">
                    <h4 className="font-bold text-lg">{formatTime(run.duration)}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Time</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RunTracker;
