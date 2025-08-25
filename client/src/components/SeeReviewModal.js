// client/src/components/SeeReviewModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// No separate CSS import

// Reusable Star Display component (read-only)
const StarDisplay = ({ rating }) => (
  <div className="star-rating read-only">
    {[...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star selected" : "star"}>★</span>
    ))}
  </div>
);

const SeeReviewModal = ({ task, onClose }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/api/reviews/task/${task._id}/byMe`, // Use the new endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    if (task?._id && user?._id) {
      fetchReviews();
    }
  }, [task?._id, user?._id]);

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent card" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Your Reviews for: "{task.taskName}"</h2>
        
        {loading && <p className="empty-state">Loading reviews...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && reviews.length === 0 && !error && (
          <p className="empty-state">No reviews found for this task by you.</p>
        )}

        {reviews.map(review => (
          <div key={review._id} className="review-display-card card"> {/* Reusing card class */}
            <h3 className="card-title">Review for {review.reviewee.fullName}</h3>
            
            <div className="rating-group">
              <label>Punctuality</label>
              <StarDisplay rating={review.ratings.punctuality} />
            </div>
            <div className="rating-group">
              <label>Friendliness</label>
              <StarDisplay rating={review.ratings.friendliness} />
            </div>
            <div className="rating-group">
              <label>Quality</label>
              <StarDisplay rating={review.ratings.quality} />
            </div>

            {review.comment && (
              <div className="form-group">
                <label>Your Comment:</label>
                <p className="review-comment-display">{review.comment}</p>
              </div>
            )}
          </div>
        ))}
        
        <div className="modal-actions">
          <button type="button" className="btn glossy primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeeReviewModal;