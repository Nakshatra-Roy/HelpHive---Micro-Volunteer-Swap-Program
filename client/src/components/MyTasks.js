import React, { useEffect, useState } from "react";
import styles from './TaskTable.module.css';
import { useTaskStore } from "../store/taskStore";
import { useAuth } from '../context/AuthContext'; 

const MyTasks = () => {
  // 1. Get `completeTask` from the store
  const { tasks, fetchTask, completeTask } = useTaskStore();
  const { user } = useAuth(); // Get logged-in user

  // Local state for loading feedback on each button
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  useEffect(() => {
    // Only fetch if tasks are not already loaded
    if (tasks.length === 0) {
      fetchTask();
    }
  }, [fetchTask, tasks.length]);

  // 2. Correctly handle the complete task action
  const handleCompleteTask = async (taskId) => {
    setLoadingTaskId(taskId); // Set loading state for this button
    // The store expects only the task ID, not the whole object
    const { success, message } = await completeTask(taskId); 
    
    if (!success) {
      console.error("Error completing task:", message);
      alert(`Error: ${message}`);
    } else {
      console.log("Success:", message);
      // The state will update automatically from the store, no need for an alert here
    }
    setLoadingTaskId(null); // Reset loading state
  };

  // 3. Filter the tasks to show ONLY the ones posted by the current user
  const myPostedTasks = tasks.filter(task => task.postedBy === user?._id);

  // Show a loading or empty state
  if (myPostedTasks.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.text}>
          You have not posted any tasks yet 😢
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.vstack}>
        <h1>My Posted Tasks</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Task Name</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Helpers</th>
              <th className={styles.th}>Due Date</th>
              <th className={styles.th}>Credits</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Map over the NEW filtered array */}
            {myPostedTasks.map((task) => (
              <tr key={task._id}>
                <td className={styles.td}>{task.taskName}</td>
                <td className={styles.td}><span className={`${styles.pill} ${styles[task.status]}`}>{task.status}</span></td>
                <td className={styles.td}>{task.curHelpers || 0} / {task.helpersReq}</td>
                <td className={styles.td}>{new Date(task.date).toLocaleDateString()}</td>
                <td className={styles.td}>{task.credits}</td>
                <td className={styles.td}>
                  {/* 5. Only show the button if the task can be completed */}
                  {task.status === 'in-progress' && (
                    <button
                      className={styles.button}
                      onClick={() => handleCompleteTask(task._id)}
                      disabled={loadingTaskId === task._id} // Disable button while loading
                    >
                      {loadingTaskId === task._id ? 'Completing...' : 'Mark as Complete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTasks;