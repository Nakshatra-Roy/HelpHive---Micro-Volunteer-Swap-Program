import React from 'react';

const ActivityStats = ({ user }) => {
  const tasksCompleted = user?.volunteerHistory?.length || 0;
  const tasksPosted = user?.myTasks?.length || 0;;
  const averageRating = user?.ratingSummary?.average || 0;
  const ratingCount = user?.ratingSummary?.count || 0;
  const creditBalance = (user?.credits?.balance || 0);

  return (
    <div className="card">
      <h2 className="card-title">Activity Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{tasksCompleted}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{tasksPosted}</div>
          <div className="stat-label">Tasks Posted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageRating > 0 ? averageRating.toFixed(2) : '—'}</div>
          <div className="stat-label">Rating ({ratingCount})</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{creditBalance}</div>
          <div className="stat-label">Credit Balance</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;