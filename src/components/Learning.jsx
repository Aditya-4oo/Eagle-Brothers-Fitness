import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, X } from 'lucide-react';
import './Learning.css';

const CATEGORIES = ['All', 'Football Skills', 'Running Tech', 'Fitness', 'Nutrition'];

const MOCK_VIDEOS = [
  {
    id: 1,
    title: 'Dribbling Fundamentals',
    category: 'Football Skills',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Public sample video
  },
  {
    id: 2,
    title: 'Perfecting Your Sprint Start',
    category: 'Running Tech',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 3,
    title: 'Core Strength for Athletes',
    category: 'Fitness',
    duration: '15:00',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  {
    id: 4,
    title: 'Pre-Match Meal Guide',
    category: 'Nutrition',
    duration: '05:30',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
];

const Learning = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState(null);

  const filteredVideos = activeCategory === 'All' 
    ? MOCK_VIDEOS 
    : MOCK_VIDEOS.filter(v => v.category === activeCategory);

  return (
    <div className="learning-container animate-fade-in">
      <div className="learning-header">
        <h2>Online Learning</h2>
        <p>Master your skills with professional video tutorials.</p>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {filteredVideos.map((video, index) => (
          <div 
            key={video.id} 
            className="video-card card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setPlayingVideo(video)}
          >
            <div 
              className="video-thumbnail"
              style={{ backgroundImage: `url(${video.thumbnail})` }}
            >
              <div className="play-overlay">
                <PlayCircle size={48} className="play-icon" />
              </div>
              <span className="video-duration">{video.duration}</span>
            </div>
            <div className="video-info">
              <span className="video-category">{video.category}</span>
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta">
                <BookOpen size={14} /> Eagle Academy
                <span className="meta-dot">•</span>
                <Clock size={14} /> {video.duration}
              </div>
            </div>
          </div>
        ))}
      </div>

      {playingVideo && (
        <div className="video-modal animate-fade-in">
          <div className="video-modal-content">
            <div className="video-modal-header">
              <h3>{playingVideo.title}</h3>
              <button className="close-btn" onClick={() => setPlayingVideo(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="video-player-wrapper">
              <video 
                controls 
                autoPlay 
                src={playingVideo.videoUrl}
                className="video-player"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-modal-details">
              <span className="video-category inline-block mb-2">{playingVideo.category}</span>
              <p className="text-secondary text-sm">
                Watch this exclusive training lesson from the Eagle Brothers coaching staff to improve your technique and performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;
