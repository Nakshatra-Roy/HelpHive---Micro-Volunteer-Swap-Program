import React, { useEffect, useState } from "react";
import styles from './TaskTable.module.css';
import { useTaskStore } from "../store/taskStore";
import { useAuth } from '../context/AuthContext'; 
import SwapModal from './SwapModal';

const MyTasks = () => {
  // Get all necessary functions from the store, including the new one
  const { tasks, fetchTask, completeTask, requestTaskSwap, initiateHelperSwap } = useTaskStore();
  const { user } = useAuth();
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State to track the task being offered and the type of swap
  const [taskInPlay, setTaskInPlay] = useState(null);
  const [swapType, setSwapType] = useState(null); // Will be 'owner' or 'helper'

  useEffect(() => {
    if (tasks.length === 0) fetchTask();
  }, [fetchTask, tasks.length]);

  // --- Handlers ---
  const handleCompleteTask = async (taskId) => {
    setLoadingTaskId(taskId);
    const { success, message } = await completeTask(taskId); 
    if (!success) alert(`Error: ${message}`);
    setLoadingTaskId(null);
  };

  // This function now opens the modal and sets what kind of swap it is
  const handleOpenModal = (task, type) => {
    setTaskInPlay(task);
    setSwapType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskInPlay(null);
    setSwapType(null);
  };

  // This one function now handles both swap types based on the state
  const handleConfirmSwap = async (theirTaskId) => {
    if (!taskInPlay || !swapType) return;

    let result;
    if (swapType === 'owner') {
      // This is the original "Owner Swap" which creates a request
      result = await requestTaskSwap(taskInPlay._id, theirTaskId);
    } else if (swapType === 'helper') {
      // This is the new "Helper Swap" which is a direct action
      result = await initiateHelperSwap(taskInPlay._id, theirTaskId);
    }
    
    if (result.success) {
      alert(result.message || "Action successful!");
    } else {
      alert(`Error: ${result.message}`);
    }
    handleCloseModal();
  };

const myPostedTasks = tasks.filter(task => task.postedBy === user?._id);

// Check if any object in helpersArray has user === user._id
const myHelperTasks = tasks.filter(task =>
  task.helpersArray?.some(helper => helper.user === user?._id || helper.user?._id === user?._id)
);


  // --- JSX ---
  return (
    <>
      {/* SECTION 1: MY POSTED TASKS (OWNER VIEW) */}
      <div className={styles.container}>
        <div className={styles.vstack}>
          <h1>My Posted Tasks</h1>
          {myPostedTasks.length > 0 ? (
            <table className={styles.table}>
               {/* ... (thead remains the same as your previous code) ... */}
              <thead>
                <tr>
                  <th className={styles.th}>Task Name</th>
                  <th className={styles.th}>Helpers</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Swap Action</th>
                </tr>
              </thead>
              <tbody>
                {myPostedTasks.map((task) => (
                  <tr key={task._id}>
                    <td className={styles.td}>{task.taskName}</td>
                    <td className={styles.td}>{task.curHelpers || 0} / {task.helpersReq}</td>
                    <td className={styles.td}>
                      {task.status === 'in-progress' && <button className={styles.button} onClick={() => handleCompleteTask(task._id)} disabled={loadingTaskId === task._id}>{loadingTaskId === task._id ? '...' : 'Mark as Complete'}</button>}
                      {task.status === 'open' && <span className={`${styles.pill} ${styles.open}`}>Open</span>}
                      {task.status === 'completed' && <span className={`${styles.pill} ${styles.open}`}>Completed</span>}
                    </td>
                    <td className={styles.td}>
                      {task.status === 'open' && <button className={styles.button} onClick={() => handleOpenModal(task, 'owner')}>Send Swap Request</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.text}>You have not posted any tasks yet.</p>}
        </div>
      </div>

      {/* SECTION 2: TASKS I'M HELPING WITH (HELPER VIEW) */}
      <div className={styles.container} style={{ marginTop: '2rem' }}>
        <div className={styles.vstack}>
          <h1>Tasks I'm Helping With</h1>
          {myHelperTasks.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Task Name</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {myHelperTasks.map(task => (
                  <tr key={task._id}>
                    <td className={styles.td}>{task.taskName}</td>
                    <td className={styles.td}><span className={`${styles.pill} ${styles[task.status]}`}>{task.status}</span></td>
                    <td className={styles.td}>
                      {task.status === 'in-progress' && (
                        <button className={styles.button} onClick={() => handleOpenModal(task, 'helper')}>
                          Request Direct Swap
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.text}>You have not accepted any tasks yet.</p>}
        </div>
      </div>
      
      {/* The same modal is used for both swap types */}
      {isModalOpen && (
        <SwapModal 
          myTaskToOffer={taskInPlay}
          onClose={handleCloseModal}
          onConfirmSwap={handleConfirmSwap}
        />
      )}
    </>
  );
};

export default MyTasks;