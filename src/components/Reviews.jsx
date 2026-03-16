import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  // Calculate average rating
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to leave a review.");
      return;
    }
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('/api/reviews', { rating, comment });
      
      setIsSubmitted(true);
      fetchReviews(); // Refresh the list
      
      // Reset form
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setComment('');
      }, 3000);
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reviews-container animate-fade-in">
      <div className="learning-header">
        <h2>Reviews & Feedback</h2>
        <p>See what parents and athletes say about us.</p>
      </div>

      {/* Summary Score */}
      <div className="rating-summary card mb-6 animate-fade-in">
        <div className="summary-score">
          <span className="big-rating">{avgRating}</span>
          <span className="out-of">/ 5</span>
        </div>
        <div className="summary-stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} fill="var(--golden-yellow)" color="var(--golden-yellow)" />
          ))}
        </div>
        <p className="text-secondary text-sm mt-1">Based on {reviews.length} reviews</p>
      </div>

      {/* Leave a Review Form */}
      <div className="leave-review-card card mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
        {isSubmitted ? (
          <div className="text-center py-4">
            <Star className="mx-auto mb-2" size={40} fill="var(--golden-yellow)" color="var(--golden-yellow)" />
            <h4>Thank you for your feedback!</h4>
            <p className="text-secondary text-sm">Your review helps us improve.</p>
          </div>
        ) : (
          <>
            <h3 className="mb-4 flex items-center gap-2">
              <MessageSquare size={18} /> Leave a Review
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="star-rating-input mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      size={28} 
                      fill={(hoverRating || rating) >= star ? "var(--golden-yellow)" : "transparent"} 
                      color={(hoverRating || rating) >= star ? "var(--golden-yellow)" : "var(--border-color)"} 
                    />
                  </button>
                ))}
              </div>
              <textarea 
                className="input-field w-full mb-4" 
                rows="3" 
                placeholder="Share your experience with Eagle Brothers..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Submit Feedback'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h3 className="mb-4">Recent Reviews</h3>
        {reviews.map((review, index) => (
          <div 
            key={review.id} 
            className="review-card card animate-fade-in"
            style={{animationDelay: `${0.2 + (index * 0.1)}s`}}
          >
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.avatar ? (
                     <img src={review.avatar} alt={review.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                     <span style={{color: 'black'}}>{review.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="reviewer-name">{review.name}</h4>
                  <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="review-stars flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "var(--golden-yellow)" : "transparent"} 
                    color={i < review.rating ? "var(--golden-yellow)" : "var(--border-color)"} 
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
