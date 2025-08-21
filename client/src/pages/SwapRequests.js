// src/pages/SwapRequests.js
import React, { useEffect, useState } from "react";
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
    return (
      <div className="card glass" style={{ padding: "1rem", textAlign: "center" }}>
        <p>You have no pending swap requests.</p>
      </div>
    );
  }

  return (
    <div className="card glass">
      <h2 style={{ marginBottom: 16 }}>Incoming Swap Requests</h2>
      <div className="table">
        <div className="row headed">
          <div>Task You'll Give</div>
          <div>Task You'll Get</div>
          <div>Requested By</div>
          <div>Actions</div>
        </div>

        {swapRequests.map((request) => (
          <div className="row tasks" key={request._id}>
            <div>{request.taskToGive.taskName}</div>
            <div>{request.taskToReceive.taskName}</div>
            <div>{request.requester.fullName}</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="btn glossy primary"
                onClick={() => handleSwapResponse(request._id, true)}
                disabled={loadingRequestId === request._id}
              >
                {loadingRequestId === request._id ? "..." : "Accept"}
              </button>
              <button
                className="btn glossy ghost"
                style={{ background: "#ff0000ff", color: "#fff" }}
                onClick={() => handleSwapResponse(request._id, false)}
                disabled={loadingRequestId === request._id}
              >
                {loadingRequestId === request._id ? "..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapRequests;