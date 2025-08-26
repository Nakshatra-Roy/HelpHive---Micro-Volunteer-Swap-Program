import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminLogbook = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchCompletedTasks = async () => {
      try {
        // Backend endpoint should return only completed tasks
        const res = await axios.get("/api/tasks/completed");
        if (alive) {
          setTasks(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch completed tasks", err);
        if (alive) setLoading(false);
      }
    };

    fetchCompletedTasks();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="skeleton logbook-skeleton"></div>;
  }

  return (
    <div className="admin-logbook-container">
      <h2 className="logbook-title">Completed Tasks Logbook</h2>

      {tasks.length === 0 ? (
        <p className="logbook-empty">No completed tasks yet.</p>
      ) : (
        <table className="logbook-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Task Name</th>
              <th>Category</th>
              <th>Posted By</th>
              <th>Helpers</th>
              <th>Credits</th>
              <th>Completed On</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={task._id} className="logbook-row">
                <td>{idx + 1}</td>
                <td>{task.taskName}</td>
                <td>{task.category}</td>
                <td>{task.postedBy?.fullName || "Unknown"}</td>
                <td>
                    {task.helpersArray.length > 0
                    ? task.helpersArray.map((h) => h.user?.firstName).join(", ")
                    : "No Helpers"}
                </td>
                <td>{task.credits}</td>
                <td>{new Date(task.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLogbook;
