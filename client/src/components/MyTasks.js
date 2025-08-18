import React, { useEffect } from "react";
import styles from './TaskTable.module.css';
import { useTaskStore } from "../store/taskStore";
import { useAuth } from '../context/AuthContext'; // <-- add this

const MyTasks = () => {
  const { tasks, fetchTask } = useTaskStore();
  const { user } = useAuth(); // <-- get logged-in user

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleSwapReq = async (user) => {
    const { success, message } = await fetchTask(task, user?._id);
    if (!success) {
      console.error("Error accepting task:", message);
      alert(`Error: ${message}`);
    } else {
      console.log("Success:", message);
      alert("Tasks retrieved successfully!");
    }
  };

  if (tasks.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.text}>
          No tasks found 😢
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.vstack}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Task Name</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Helpers Required</th>
              <th className={styles.th}>Current Helpers</th>
              <th className={styles.th}>Due Date</th>
              <th className={styles.th}>Priority</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className={styles.td}>{task.taskName}</td>
                <td className={styles.td}>{task.category}</td>
                <td className={styles.td}>{task.location}</td>
                <td className={styles.td}>{task.helpersReq}</td>
                <td className={styles.td}>{task.curHelpers || 0}</td>
                <td className={styles.td}>{task.date}</td>
                <td className={styles.td}>{task.priority}</td>
                <td className={styles.td}>
                  <button
                    className={styles.button}
                    onClick={() => handleSwapReq(task)}
                  >
                    Swap This Task
                  </button>
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
