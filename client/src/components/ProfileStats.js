import React from 'react';
import './ProfileComponents.css';

function ProfileStats({ user }) {
  // Use actual user data where available, fallback to defaults
  const stats = {
    tasksCompleted: 0,
    tasksPosted: 0,
    rating: user.ratingSummary?.average || 0,
    joinedDate: new Date(user.createdAt).toLocaleDateString(),
    creditsEarned: user.credits?.earned || 0,
    creditsSpent: user.credits?.spent || 0
  };

  return (
    <div className="profile-stats">
      <h2 className="section-title">Activity Stats</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.tasksCompleted}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.tasksPosted}</div>
          <div className="stat-label">Tasks Posted</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.rating || '—'}</div>
          <div className="stat-label">Rating ({user.ratingSummary?.count || 0})</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.creditsEarned - stats.creditsSpent}</div>
          <div className="stat-label">Credit Balance</div>
        </div>
      </div>
      
      <div className="volunteer-history">
        <h3>Volunteer History</h3>
        {Array.isArray(user.volunteerHistory) && user.volunteerHistory.length > 0 ? (
          <div className="history-list">
            {user.volunteerHistory.map((history, index) => (
              <div key={index} className="history-item">
                <h4>{history.title || 'Volunteer Activity'}</h4>
                <p>{history.description || 'No description provided'}</p>
                <div className="history-meta">
                  <span>{new Date(history.date).toLocaleDateString()}</span>
                  {history.hours && <span>{history.hours} hours</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No volunteer history to display.</p>
        )}
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <p className="empty-state">No recent activity to display.</p>
      </div>
    </div>
  );
}

export default ProfileStats;