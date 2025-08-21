import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";
import SwapModal from "../components/SwapModal";

const MyTasks = () => {
  const { tasks, fetchTask, completeTask, requestTaskSwap, initiateHelperSwap } = useTaskStore();
  const { user } = useAuth();
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskInPlay, setTaskInPlay] = useState(null);
  const [swapType, setSwapType] = useState(null);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    if (tasks.length === 0) fetchTask();
  }, [fetchTask, tasks.length]);

  const handleCompleteTask = async (taskId) => {
    setLoadingTaskId(taskId);
    const { success, message } = await completeTask(taskId);
    if (!success) alert(`Error: ${message}`);
    setLoadingTaskId(null);
  };

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

  const handleConfirmSwap = async (theirTaskId) => {
    if (!taskInPlay || !swapType) return;

    let result;
    if (swapType === "owner") {
      result = await requestTaskSwap(taskInPlay._id, theirTaskId);
    } else if (swapType === "helper") {
      result = await initiateHelperSwap(taskInPlay._id, theirTaskId);
    }

    if (result.success) {
      alert(result.message || "Action successful!");
    } else {
      alert(`Error: ${result.message}`);
    }
    handleCloseModal();
  };

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

  const myPostedTasks = tasks.filter((task) => task.postedBy === user?._id);
  const myHelperTasks = tasks.filter((task) =>
    task.helpersArray?.some(
      (helper) => helper.user === user?._id || helper.user?._id === user?._id
    )
  );

  return (
    <>
      {/* --- POSTED TASKS --- */}
      <div className="card glass">
        <h2 style={{ marginBottom: 16 }}>My Posted Tasks</h2>
        <div className="table">
          <div className="row headed">
            <div>Task Name</div>
            <div>Helpers</div>
            <div>Status</div>
            <div>Swap Action</div>
          </div>

          {myPostedTasks.length > 0 ? (
            myPostedTasks.map((task) => (
              <div className="row tasks" key={task._id} style={{ position: "relative" }}>
                <div>{task.taskName}</div>
                <div>{task.curHelpers || 0} / {task.helpersReq}</div>
                <div>
                  {task.status === "in-progress" && (
                    <button
                      onClick={() => handleCompleteTask(task._id)}
                      className="btn glossy primary"
                      disabled={loadingTaskId === task._id}
                      aria-busy={loadingTaskId === task._id}
                    >
                      {loadingTaskId === task._id ? "..." : "Mark Complete"}
                    </button>
                  )}
                  {task.status === "open" && <span className="task-status status-open">Open</span>}
                  {task.status === "completed" && (
                    <span className="task-status status-completed">Completed</span>
                  )}
                </div>
                <div>
                  {task.status === "open" && (
                    <button
                      className="btn glossy primary"
                      onClick={() => handleOpenModal(task, "owner")}
                    >
                      Send Swap Request
                    </button>
                  )}
                </div>
                <div className="task-hover-info">
                  <p><strong>Description:</strong> {task.taskDescription}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                  <p><strong>Location:</strong> {task.location}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Credits:</strong> {task.credits}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="row">
              <div style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
                You haven’t posted any tasks yet.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- TASKS I'M HELPING WITH --- */}
      <div className="card glass" style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: 16 }}>Tasks I'm Helping With</h2>
        <div className="table">
          <div className="row headed">
            <div>Task Name</div>
            <div>Helpers</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {myHelperTasks.length > 0 ? (
            myHelperTasks.map((task) => (
              <HelperTaskRow
                key={task._id}
                task={task}
                getPostedByName={getPostedByName}
                handleOpenModal={handleOpenModal}
              />
            ))
          ) : (
            <div className="row">
              <div style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
                You haven’t accepted any tasks yet.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <SwapModal
          myTaskToOffer={taskInPlay}
          onClose={handleCloseModal}
          onConfirmSwap={handleConfirmSwap}
        />
      )}

      <style>
        {`
          .row:hover .task-hover-info { display: block; }
          .task-hover-info {
            display: none;
            position: absolute;
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: black;
            padding: 12px 16px;
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
            border-radius: 10px;
            right: 100%;
            z-index: 9999;
            width: max-content;
            max-width: 320px;
            font-size: 0.85rem;
            line-height: 1.4;
          }
        `}
      </style>
    </>
  );
};

// ✅ New Component to avoid Hook violation
const HelperTaskRow = ({ task, getPostedByName, handleOpenModal }) => {
  const [posterName, setPosterName] = useState("Loading...");

  useEffect(() => {
    const fetchName = async () => {
      const name = await getPostedByName(task.postedBy);
      setPosterName(name);
    };
    fetchName();
  }, [task.postedBy, getPostedByName]);

  return (
    <div className="row tasks" style={{ position: "relative" }}>
      <div>{task.taskName}</div>
      <div>{task.curHelpers || 0} / {task.helpersReq}</div>
      <div>
        <span className="task-status status-in-progress">{task.status}</span>
      </div>
      <div>
        {task.status === "in-progress" && (
          <button
            className="btn glossy primary"
            onClick={() => handleOpenModal(task, "helper")}
          >
            Request Direct Swap
          </button>
        )}
      </div>
      <div className="task-hover-info">
        <p><strong>Posted by:</strong> {posterName}</p>
        <p><strong>Description:</strong> {task.taskDescription}</p>
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Location:</strong> {task.location}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Credits:</strong> {task.credits}</p>
      </div>
    </div>
  );
};

export default MyTasks;