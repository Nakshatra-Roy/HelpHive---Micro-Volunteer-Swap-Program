import React from 'react';

const AdminSummary = ({ stats }) => {
    if (!stats) return null;

    const { users, tasks } = stats;

    return (
        <div>
            <h2 className="card-title">Platform Summary</h2>
            <div className="summary-stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{users.total}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{users.volunteers}</div>
                    <div className="stat-label">Volunteers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{users.admins}</div>
                    <div className="stat-label">Admins</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{tasks.total}</div>
                    <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{tasks.completed}</div>
                    <div className="stat-label">Completed Tasks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{tasks.active}</div>
                    <div className="stat-label">Active Tasks</div>
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;