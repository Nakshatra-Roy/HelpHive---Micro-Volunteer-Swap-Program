import React, { useEffect, useState } from "react";
import styles from './TaskTable.module.css'; // You can reuse the same styles
import { useTaskStore } from "../store/taskStore";
import { useNotificationStore } from "../store/notificationStore"; // <-- Import new store
import { useAuth } from '../context/AuthContext'; 

const SwapRequests = () => {
  // Get functions from both stores
  const { respondToSwapRequest } = useTaskStore();
  const { notifications, fetchNotifications, removeNotification } = useNotificationStore();
  const { user } = useAuth(); // Needed to confirm user is loaded

  // State for showing loading on individual buttons
  const [loadingRequestId, setLoadingRequestId] = useState(null);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, [fetchNotifications]);

  // Handler for both "Accept" and "Reject" buttons
  const handleSwapResponse = async (notification, accepted) => {
    setLoadingRequestId(notification._id);
    
    const { success, message } = await respondToSwapRequest(
      notification.reference.taskToGive,   // theirTaskId
      notification.reference.taskToReceive, // myTaskId
      accepted
    ); 
    
    if (!success) {
      console.error("Error responding to swap:", message);
      alert(`Error: ${message}`);
    } else {
      // On success, remove the notification from the list
      removeNotification(notification._id);
      alert(`Success: ${message}`);
    }
    setLoadingRequestId(null);
  };

  if (notifications.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.text}>
          You have no pending swap requests.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.vstack}>
        <h1>Incoming Swap Requests</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Task You'll Give Up</th>
              <th className={styles.th}>Task You'll Receive</th>
              <th className={styles.th}>Requested By</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                {/* Note: This assumes your backend POPULATES the task and sender details */}
                <td className={styles.td}>{notification.reference.taskToReceive?.taskName || 'N/A'}</td>
                <td className={styles.td}>{notification.reference.taskToGive?.taskName || 'N/A'}</td>
                <td className={styles.td}>{notification.sender?.name || 'A User'}</td>
                <td className={styles.tdActions}>
                  <button
                    className={`${styles.button} ${styles.accept}`}
                    onClick={() => handleSwapResponse(notification, true)}
                    disabled={loadingRequestId === notification._id}
                  >
                    {loadingRequestId === notification._id ? '...' : 'Accept'}
                  </button>
                  <button
                    className={`${styles.button} ${styles.reject}`}
                    onClick={() => handleSwapResponse(notification, false)}
                    disabled={loadingRequestId === notification._id}
                  >
                    {loadingRequestId === notification._id ? '...' : 'Reject'}
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

export default SwapRequests;