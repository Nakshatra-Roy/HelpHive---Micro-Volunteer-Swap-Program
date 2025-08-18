import React, { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useAuth } from "../context/AuthContext";

function ViewTasks() {
  const { tasks, fetchTask, acceptTask } = useTaskStore();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [acceptPending, setAcceptPending] = useState(new Set());

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchTask();
      } catch {
        // no-op; UI handles empty/error similarly
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchTask]);

  useEffect(() => {
    setList(tasks || []);
  }, [tasks]);

  const placeholders = useMemo(() => Array.from({ length: 8 }), []);

  const handleAcceptTask = async (task) => {
    if (!task?._id || !user?._id) return;
    const id = task._id;
    if (acceptPending.has(id)) return;

    const cur = task.curHelpers || 0;
    const req = task.helpersReq || 0;
    const isFull = cur >= req;
    if (isFull) {
      alert("This task is already full.");
      return;
    }

    setAcceptPending((prev) => new Set(prev).add(id));
    // optimistic bump
    setList((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, curHelpers: (t.curHelpers || 0) + 1 } : t
      )
    );

    try {
      const { success, message } = await acceptTask(task, user._id);
      if (!success) {
        // revert
        setList((prev) =>
          prev.map((t) =>
            t._id === id
              ? { ...t, curHelpers: Math.max((t.curHelpers || 1) - 1, 0) }
              : t
          )
        );
        alert(`Error: ${message}`);
      } else {
        alert("Task accepted successfully!");
      }
    } catch {
      // revert
      setList((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, curHelpers: Math.max((t.curHelpers || 1) - 1, 0) }
            : t
        )
      );
      alert("Error accepting task");
    } finally {
      setAcceptPending((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  return (
    <>
      <div className="backdrop">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid-overlay" />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>All Tasks</h2>
          </div>

          <div className="card glass">
            <div className="table">
              <div className="row head">
                <div>#</div>
                <div>Task Name</div>
                <div>Category</div>
                <div>Location</div>
                <div>Helpers Required</div>
                <div>Current Helpers</div>
                <div>Due Date</div>
                <div>Priority</div>
                <div>Actions</div>
              </div>

              {(loading ? placeholders : list).map((t, i) => {
                const id = t?._id || i;
                const cur = t?.curHelpers || 0;
                const req = t?.helpersReq || 0;
                const isFull = !loading && cur >= req;
                const isBusy = t?._id ? acceptPending.has(t._id) : false;

                return (
                  <div
                    className={`row ${loading ? "skeleton" : ""}`}
                    key={id}
                    style={{ position: "relative" }}
                  >
                    <div>{i + 1}</div>
                    <div>{t?.taskName || (loading ? "—" : "—")}</div>
                    <div>{t?.category || (loading ? "—" : "—")}</div>
                    <div>{t?.location || (loading ? "—" : "—")}</div>
                    <div>{req || (loading ? "—" : 0)}</div>
                    <div>{cur || (loading ? "—" : 0)}</div>
                    <div>{t?.date
                          ? new Date(t.date).toLocaleDateString("en-GB", { // or "en-US"
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}</div>
                    <div>{t?.priority || (loading ? "—" : "—")}</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {!loading ? (
                        <button
                          onClick={() => t && handleAcceptTask(t)}
                          className="btn glossy primary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.8rem",
                            background: !isFull ? "#10b981" : undefined,
                          }}
                          disabled={isBusy || isFull || !user?._id}
                          aria-busy={isBusy}
                          title={
                            !user?._id ? "Login required" : isFull ? "Task is full" : "Accept this task"
                          }
                        >
                          {isBusy ? "..." : isFull ? "Full" : "Accept"}
                        </button>
                      ) : (
                        <div className="pill">—</div>
                      )}
                    </div>

                    <div className="task-hover-info">
                      <p><strong>Description:</strong> {t?.taskDescription || "—"}</p>
                      {/* <p>
                        <strong>Requirements:</strong>{" "}
                        {Array.isArray(t?.requirements) && t?.requirements?.length
                          ? t.requirements.join(", ")
                          : t?.requirements || "—"}
                      </p>
                      <p><strong>Contact:</strong> {t?.contactEmail || t?.contactPhone || "—"}</p>
                      <p><strong>Posted by:</strong> {t?.createdBy?.name || t?.createdBy || "—"}</p>
                      <p><strong>Notes:</strong> {t?.notes || "—"}</p> */}
                    </div>
                  </div>
                );
              })}

              {!loading && list.length === 0 && (
                <div className="row">
                  <div style={{ gridColumn: "1 / -1", opacity: 0.8 }}>No tasks found 😢</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
        /* Mirror AdminUsers hover card pattern */
        .table {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .row {
        display: grid;
        grid-template-columns: 40px 1.5fr 1fr 1fr 1fr 1fr 1.2fr 1fr 1fr;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }

      .row.head {
        font-weight: bold;
        background: rgba(255,255,255,0.05);
      }

      .pill {
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(255,255,255,0.1);
      }

        .row:hover .task-hover-info { display: block; }
        .task-hover-info {
          display: none;
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
        .row.head {
  font-weight: bold;
  background: #d9f99d;
}
        /* Disabled buttons keep same feel as AdminUsers */
        .btn[disabled] { opacity: 0.6; cursor: not-allowed; }
        `}
      </style>
    </>
  );
}

export default ViewTasks;