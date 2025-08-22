import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTasks = ({ userId, onStartChat }) => {
  const [tasksCreated, setTasksCreated] = useState([]);
  const [tasksHelping, setTasksHelping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState({}); // Cache of userId → fullName

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

  const getPostedByName = async (userId) => {
    if (userMap[userId]) return userMap[userId];

    try {
      const res = await axios.get(`/api/users/${userId}`);
      const fullName = res.data.fullName || 'Unknown';
      setUserMap((prev) => ({ ...prev, [userId]: fullName }));
      return fullName;
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      return 'Unknown';
    }
  };

  const TaskCard = ({ task, showPostedBy }) => {
    const [posterName, setPosterName] = useState('');

    useEffect(() => {
      if (showPostedBy && task.postedBy) {
        const fetchName = async () => {
          const name = await getPostedByName(task.postedBy);
          setPosterName(name);
        };
        fetchName();
      }
    }, [task.postedBy, showPostedBy]);

    return (
      <div className="card">
        <div className="task-card-header">
          <h4 className="task-card-title">{task.taskName}</h4>
          <span className={`task-status status-${(task.status || 'unknown').toLowerCase()}`}>
            {task.status || 'Unknown'}
          </span>
        </div>
        {showPostedBy && <span className="task-status status-open">by {posterName}</span>}
        <p></p>
        <p className="task-card-description">{task.taskDescription}</p>
        <div className="task-card-details">
          <div><strong>Category:</strong> {task.category}</div>
          <div><strong>Location:</strong> {task.location}</div>
          <div><strong>Priority:</strong> {task.priority}</div>
          <div><strong>Credits:</strong> {task.credits}</div>
          <div><strong>Helpers:</strong> {task.curHelpers || 0} / {task.helpersReq}</div>
        </div>
        <div className="task-card-actions">
        {task.status === 'in-progress' && (
          <button
            onClick={() => onStartChat(task._id)}
            className="chat-button"
          >
            Open Chat
          </button>
        )}
      </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="backdrop">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid-overlay" />
      </div>  
      <div className="loading-tasks">Loading tasks. Please wait...</div>;
      </div>)
  }

  return (
    <div className="card">
      <h2 className="card-title">My Tasks</h2>

      {/* Tasks I've Posted */}
      <div className="tasks-section">
        <h3 className="tasks-subtitle">Tasks I've Posted</h3>
        {tasksCreated.length > 0 ? (
          <div className="tasks-list">
            {tasksCreated.map(task => (
              <TaskCard key={task._id} task={task} showPostedBy={false} />
            ))}
          </div>
        ) : (
          <p className="empty-state">You haven't posted any tasks yet.</p>
        )}
      </div>

      {/* Tasks I'm Helping With */}
      <div className="tasks-section">
        <h3 className="tasks-subtitle">Tasks I'm Helping With</h3>
        {tasksHelping.length > 0 ? (
          <div className="tasks-list">
            {tasksHelping.map(task => (
              <TaskCard key={task._id} task={task} showPostedBy={true} />
            ))}
          </div>
        ) : (
          <p className="empty-state">You haven't accepted any tasks yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserTasks;