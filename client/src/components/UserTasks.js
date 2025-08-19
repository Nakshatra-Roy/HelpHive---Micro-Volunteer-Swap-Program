import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserTasks.css'; // This CSS is already designed to handle the new field

const UserTasks = ({ userId }) => {
  const [tasksCreated, setTasksCreated] = useState([]);
  const [tasksHelping, setTasksHelping] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/tasks`);
        setTasksCreated(response.data.created);
        setTasksHelping(response.data.helping);
      } catch (error) {
        console.error("Error fetching user's tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [userId]);

  if (loading) {
    return <div className="loading-tasks">Loading tasks...</div>;
  }

  // This is a reusable component to display a single task card
  const TaskCard = ({ task }) => (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className="task-card-title">{task.taskName}</h4>
        <span className={`task-status status-${(task.status || 'unknown').toLowerCase()}`}>
          {task.status || 'Unknown'}
        </span>
      </div>
      <p className="task-card-description">{task.taskDescription}</p>
      <div className="task-card-details">
        <div><strong>Category:</strong> {task.category}</div>
        <div><strong>Location:</strong> {task.location}</div>
        <div><strong>Priority:</strong> {task.priority}</div>
        <div><strong>Credits:</strong> {task.credits}</div>
        {/* --- THIS IS THE NEWLY ADDED LINE --- */}
        <div><strong>Helpers:</strong> {task.curHelpers || 0} / {task.helpersReq}</div>
      </div>
      <div className="task-card-actions">
        {task.status === 'in-progress' && (
          <Link to={`/chat/${task._id}`} className="chat-button">
            Go to Chat
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-card">
      <h2 className="card-title">My Tasks</h2>

      {/* Section for tasks the user created */}
      <div className="tasks-section">
        <h3 className="tasks-subtitle">Tasks I've Posted</h3>
        {tasksCreated.length > 0 ? (
          <div className="tasks-list">
            {tasksCreated.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        ) : (
          <p className="empty-state">You haven't posted any tasks yet.</p>
        )}
      </div>

      {/* Section for tasks the user is helping with */}
      <div className="tasks-section">
        <h3 className="tasks-subtitle">Tasks I'm Helping With</h3>
        {tasksHelping.length > 0 ? (
          <div className="tasks-list">
            {tasksHelping.map(task => <TaskCard key={task._id} task={task} />)}
          </div>
        ) : (
          <p className="empty-state">You haven't signed up to help with any tasks yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserTasks;