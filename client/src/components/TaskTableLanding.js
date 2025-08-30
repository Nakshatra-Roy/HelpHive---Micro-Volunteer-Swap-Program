import React, { useMemo, useState } from "react";
import axios from "axios";

const TaskTableLanding = ({
  tasks = [],
  loading = false,
  sortOrder = "desc",
}) => {
  const placeholders = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({ _id: `placeholder-${i}` })),
    []
  );
  const [userMap, setUserMap] = useState({});
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  const sortedTasks = useMemo(() => {
    if (loading) return placeholders;
    return [...tasks].sort((a, b) => {
      const creditA = a?.credits ?? 0;
      const creditB = b?.credits ?? 0;
      return sortOrder === "asc" ? creditA - creditB : creditB - creditA;
    });
  }, [tasks, loading, sortOrder, placeholders]);

  const rows = loading ? placeholders : sortedTasks;

  // const getPostedByName = async (userId) => {
  //   if (userMap[userId]) return userMap[userId];
  //   try {
  //     const res = await axios.get(`/api/users/${userId}`);
  //     const fullName = res.data.fullName || "Unknown";
  //     setUserMap((prev) => ({ ...prev, [userId]: fullName }));
  //     return fullName;
  //   } catch (err) {
  //     console.error(`Error fetching user ${userId}:`, err);
  //     return "Unknown";
  //   }
  // };

  return (
    <>
      <div className="card glass">
        <div className="table">
          <div className="row headerLanding">
            <div>#</div>
            <div>Task Name</div>
            <div>Category</div>
            <div>Location</div>
            <div>Current Helpers</div>
            <div>Due Date</div>
            <div>Credits</div>
          </div>

          {rows.map((t, i) => {
            const id = loading ? i : t?._id || i;

            return (
              <div
                className="row"
                key={id}
                style={{ position: "relative" }}
                onMouseEnter={async () => {
                  setHoveredTaskId(t._id);
                  // if (!userMap[t?.postedBy]) {
                  //   await getPostedByName(t.postedBy);
                  // }
                }}
                onMouseLeave={() => setHoveredTaskId(null)}
              >
                <div>{i + 1}</div>
                <div>{t?.taskName || "—"}</div>
                <div>{t?.category || "—"}</div>
                <div>{t?.location || "—"}</div>
                <div>{t?.curHelpers ?? "—"}</div>
                <div>
                  {t?.date
                    ? new Date(t.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </div>
                <div className="credits-cell">{t?.credits || "—"}</div>

                {hoveredTaskId === t._id && (
                  <div className="task-hover-info">
                    <p>
                      <strong>Posted by:</strong> {t?.postedBy?.fullName}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {t?.taskDescription || "—"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {!loading && tasks.length === 0 && (
            <div className="row">
              <div style={{ gridColumn: "1 / -1", opacity: 0.8 }}>
                No tasks found.
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .table {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .row {
          display: grid;
          grid-template-columns: 40px 2fr 1.2fr 1.2fr 1fr 1.2fr 1fr;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .row.header {
          font-weight: bold;
          background: #d9f99d;
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
        .credits-cell {
          text-align: right;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default TaskTableLanding;