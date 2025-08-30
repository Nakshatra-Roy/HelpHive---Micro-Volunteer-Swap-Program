import React from 'react';

const StarDisplay = ({ rating }) => (
  <div className="star-rating read-only">
    {[...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star selected" : "star"}>★</span>
    ))}
  </div>
);

const SeeReviewModal = ({ review, onClose }) => {
  if (!review) {
    return null;
  }

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="card glass" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Your Review for {review.reviewee.fullName}</h2>
        
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