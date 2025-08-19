// src/components/SwapModal.js
import React from 'react';
import styles from './SwapModal.module.css';
import { useTaskStore } from '../store/taskStore';
import { useAuth } from '../context/AuthContext';

const SwapModal = ({ myTaskToOffer, onClose, onConfirmSwap }) => {
  const { tasks } = useTaskStore();
  const { user } = useAuth();


  const availableTasks = tasks.filter(task => 
    task.postedBy !== user?._id && task.status === 'open'
  );

  if (!myTaskToOffer) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Select a Task to Swap With</h2>
        <p>You are offering your task: <strong>{myTaskToOffer.taskName}</strong></p>
        
        <div className={styles.taskList}>
          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <div key={task._id} className={styles.taskItem}>
                <span>{task.taskName} (Credits: {task.credits})</span>
                <button 
                  className={styles.swapButton}
                  onClick={() => onConfirmSwap(task._id)}
                >
                  Request Swap
                </button>
              </div>
            ))
          ) : (
            <p>No other tasks are available to swap with right now.</p>
          )}
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SwapModal;

