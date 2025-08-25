// client/src/components/LeaveReviewModal.js

import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Star Rating is a small, self-contained component.
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={ratingValue}
            className={ratingValue <= rating ? "star selected" : "star"}
            onClick={() => setRating(ratingValue)}
          >★</span>
        );
      })}
    </div>
  );
};

const LeaveReviewModal = ({ task, onClose, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null); // The user being reviewed
  const [ratings, setRatings] = useState({ punctuality: 0, friendliness: 0, quality: 0 });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine who the user can review
  const taskCreator = task.postedBy;
  const helpers = task.helpersArray.map(h => h.user).filter(Boolean);
  const isCreator = user._id === taskCreator._id;
  const reviewableUsers = isCreator ? helpers : [taskCreator];

  // Filter out users who have already been reviewed for this task
  const unreviewedUsers = reviewableUsers.filter(u => !task.reviewsSubmittedByMe?.includes(u._id));
  
  // If there's only one person left to review, select them automatically
  useEffect(() => {
    if (unreviewedUsers.length === 1) {
      setTargetUser(unreviewedUsers[0]);
    }
  }, [task]); // Reruns if the task prop changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUser) { /* ... */ }
    if (Object.values(ratings).some(r => r === 0)) { /* ... */ }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post( // <-- Capture the response
        '/api/reviews',
        { taskId: task._id, revieweeId: targetUser._id, ratings, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Check for a successful status code
      if (response.status === 201) {
        onReviewSubmitted(targetUser);
        onClose();
      } else {
        // Handle unexpected success codes
        setError('Received an unexpected response from the server.');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  // If there's no one left to review, show a message
  if (unreviewedUsers.length === 0) {
    return (
      <div className="modalBackdrop" onClick={onClose}>
        <div className="modalContent card" onClick={(e) => e.stopPropagation()}>
          <h2 className="section-title">Leave a Review</h2>
          <p className="empty-state">You have already reviewed all participants for this task.</p>
          <div className="modal-actions">
            <button type="button" className="btn glossy primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent card" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Leave a Review for: "{task.taskName}"</h2>
        
        {/* User Selection: Only show this screen if a target hasn't been chosen yet */}
        {!targetUser && (
          <div className="form-group">
            <label>Who would you like to review?</label>
            {/* --- WRAP THIS DIV... --- */}
            <div className="scrollable-user-list">
              <div className="user-selection-pills">
                {unreviewedUsers.map(u => (
                  <button
                    key={u._id}
                    className="btn glossy primary tiny"
                    onClick={() => setTargetUser(u)}
                  >
                    {u.fullName}
                  </button>
                ))}
              </div>
            </div>
            {/* --- ...IN OUR NEW SCROLLABLE CONTAINER --- */}
          </div>
        )}

        {/* The Review Form: Only show this screen AFTER a target user has been chosen */}
        {targetUser && (
          <form onSubmit={handleSubmit}>
            <p className="review-target-text">
              You are reviewing: <strong>{targetUser.fullName}</strong>
            </p>

            <div className="rating-group">
              <label>Punctuality</label>
              <StarRating rating={ratings.punctuality} setRating={(v) => setRatings(p=>({...p, punctuality:v}))} />
            </div>
            <div className="rating-group">
              <label>Friendliness</label>
              <StarRating rating={ratings.friendliness} setRating={(v) => setRatings(p=>({...p, friendliness:v}))} />
            </div>
            <div className="rating-group">
              <label>Quality</label>
              <StarRating rating={ratings.quality} setRating={(v) => setRatings(p=>({...p, quality:v}))} />
            </div>

            <div className="form-group">
              <label>Comment (optional)</label>
              <textarea
                className="input-full"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="modal-actions">
              <button type="button" className="btn glossy ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn glossy primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeaveReviewModal;