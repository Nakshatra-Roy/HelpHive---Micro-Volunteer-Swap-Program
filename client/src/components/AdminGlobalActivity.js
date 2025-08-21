import React from 'react';

const AdminGlobalActivity = ({ stats }) => {
    if (!stats) return null;

    const { tasksCompletionRate, averageTasksPerUser } = stats;

    return (
        <div>
            <h2 className="card-title">Global Activity</h2>
            <div className="stat-card">
                <span className="activity-label">Tasks Completion Rate:</span>
                <span className="activity-value">{(tasksCompletionRate || 0).toFixed(2)}%</span>
                <p className="activity-description">
                    The percentage of tasks that have been successfully completed by volunteers.
                </p>
            </div>
            <br/>
            <div className="stat-card">
                <span className="activity-label">Average Tasks Per User:</span>
                <span className="activity-value">{(averageTasksPerUser || 0).toFixed(2)}</span>
                <p className="activity-description">
                    The average number of tasks each user has engaged with on the platform.
                </p>
            </div>
        </div>
    );
};

export default AdminGlobalActivity;