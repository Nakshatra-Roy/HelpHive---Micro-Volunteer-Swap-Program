import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

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
  const [targetUser, setTargetUser] = useState(null); 
  const [ratings, setRatings] = useState({ punctuality: 0, friendliness: 0, quality: 0 });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const taskCreator = task.postedBy;
  const helpers = task.helpersArray.map(h => h.user).filter(Boolean);
  const isCreator = user._id === taskCreator._id;
  const reviewableUsers = isCreator ? helpers : [taskCreator];



  const unreviewedUsers = reviewableUsers.filter(u => !task.reviewsSubmittedByMe?.includes(u._id));
  
  useEffect(() => {
    if (unreviewedUsers.length === 1) {
      setTargetUser(unreviewedUsers[0]);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUser) { /* ... */ }
    if (Object.values(ratings).some(r => r === 0)) { /* ... */ }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/reviews',
        { taskId: task._id, revieweeId: targetUser._id, ratings, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 201) {
        onReviewSubmitted(targetUser);
        onClose();
      } else {
        toast.error('Received an unexpected response from the server.');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  // If there's no one left to review, show a message
  if (unreviewedUsers.length === 0) {
    return (
      <div className="modalBackdrop" onClick={onClose}>
        <div className="card glass" onClick={(e) => e.stopPropagation()}>
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
      <div className="card glass" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Leave a Review for: "{task.taskName}"</h2>
        
        {!targetUser && (
          <div className="form-group">
            <label>Who would you like to review?</label>
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
          </div>
        )}

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
              <button type="submit" className="btn glossy primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              
              <button type="button" className="btn glossy ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeaveReviewModal;