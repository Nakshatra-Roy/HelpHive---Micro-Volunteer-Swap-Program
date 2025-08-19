// src/pages/SwapRequests.js
import React, { useEffect, useState } from "react";
import styles from './style.css'; // Assuming you have this CSS file
import { useTaskStore } from "../store/taskStore";

const SwapRequests = () => {
  const { swapRequests, fetchSwapRequests, respondToSwapRequest } = useTaskStore();
  const [loadingRequestId, setLoadingRequestId] = useState(null);

  useEffect(() => {
    fetchSwapRequests();
  }, [fetchSwapRequests]);

  const handleSwapResponse = async (requestId, accepted) => {
    setLoadingRequestId(requestId);
    const { success, message } = await respondToSwapRequest(requestId, accepted);
    if (!success) alert(`Error: ${message}`);
    setLoadingRequestId(null);
  };

  if (!swapRequests || swapRequests.length === 0) {
    return <div className={styles.container}><p className={styles.text}>You have no pending swap requests.</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.vstack}>
        <h1>Incoming Swap Requests</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Task You'll Give</th>
              <th className={styles.th}>Task You'll Get</th>
              <th className={styles.th}>Requested By</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {swapRequests.map((request) => (
              <tr key={request._id}>
                <td className={styles.td}>{request.taskToGive.taskName}</td>
                <td className={styles.td}>{request.taskToReceive.taskName}</td>
                <td className={styles.td}>{request.requester.name}</td>
                <td className={styles.tdActions}>
                  <button className={`${styles.button} ${styles.accept}`} onClick={() => handleSwapResponse(request._id, true)} disabled={loadingRequestId === request._id}>Accept</button>
                  <button className={`${styles.button} ${styles.reject}`} onClick={() => handleSwapResponse(request._id, false)} disabled={loadingRequestId === request._id}>Reject</button>
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