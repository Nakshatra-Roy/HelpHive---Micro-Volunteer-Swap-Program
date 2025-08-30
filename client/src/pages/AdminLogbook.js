import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
  import toast, { Toaster } from 'react-hot-toast';

const AdminLogbook = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  const placeholders = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({ _id: `placeholder-${i}` })),
    []
  );

  useEffect(() => {
    let alive = true;

    const fetchCompletedTasks = async () => {
      try {
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

  const rows = loading ? placeholders : tasks;

  return (
    <div className="card glass">
      <h2 style={{ padding: "12px" }}>Completed Tasks Logbook</h2>

      <div className="table">
        <div className="row header">
          <div>#</div>
          <div>Task Name</div>
          <div>Category</div>
          <div>Posted By</div>
          <div>Helpers</div>
          <div>Credits</div>
          <div>Completed On</div>
        </div>

        {rows.map((t, i) => (
          <div
            className="row"
            key={loading ? i : t._id || i}
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveredTaskId(t._id)}
            onMouseLeave={() => setHoveredTaskId(null)}
          >
            <div>{i + 1}</div>
            <div>{loading ? "—" : t.taskName || "—"}</div>
            <div>{loading ? "—" : t.category || "—"}</div>
            <div>{loading ? "—" : t.postedBy?.fullName || "Unknown"}</div>
            <div>
              {loading
                ? "—"
                : t.helpersArray?.length > 0
                ? t.helpersArray.map((h) => h.user?.fullName).join(", ")
                : "No Helpers"}
            </div>
            <div className="credits-cell">{loading ? "—" : t.credits ?? "—"}</div>
            <div>
              {loading
                ? "—"
                : t.date
                ? new Date(t.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>

            {hoveredTaskId === t._id && !loading && (
              <div className="task-hover-info">
                <p>
                  <strong>Description:</strong>{" "}
                  {t?.taskDescription || "—"}
                </p>
              </div>
            )}
          </div>
        ))}

        {!loading && tasks.length === 0 && (
          <div className="row">
            <div style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
              No completed tasks yet.
            </div>
          </div>
        )}
      </div>
      <Toaster
            position="bottom-right"
            reverseOrder={false}
          />

      <style>{`
        .table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .row {
          display: grid;
          grid-template-columns: 40px 2fr 1fr 1fr 1.5fr 1fr 1.2fr;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .row.header {
          grid-template-columns: 40px 2fr 1fr 1fr 1.5fr 1fr 1.2fr;
          font-weight: bold;
          background: #d9f99d;
        }
        .credits-cell {
          text-align: left;
          font-weight: 500;
        }
        .task-hover-info {
          display: block;
          position: absolute;
          background: white;
          color: black;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border-radius: 8px;
          top: 100%;
          left: 0;
          z-index: 10;
          width: max-content;
          max-width: 320px;
        }
      `}</style>
    </div>
  );
};

export default AdminLogbook;