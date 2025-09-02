import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const TaskTable = ({
  tasks = [],
  loading = false,
  userId,
  busyIds = new Set(),
  onAccept,
  sortOrder = "desc",
}) => {
  const placeholders = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        _id: `placeholder-${i}`,
      })),
    []
  );

  const sortedTasks = useMemo(() => {
    if (loading) return placeholders;
    return [...tasks].sort((a, b) => {
      const creditA = a?.credits ?? 0;
      const creditB = b?.credits ?? 0;
      return sortOrder === "asc" ? creditA - creditB : creditB - creditA;
    });
  }, [tasks, loading, sortOrder, placeholders]);

  const rows = loading ? placeholders : sortedTasks;

  return (
    <div className="feed-container">
      {rows.map((t, i) => {
        const id = loading ? i : t?._id || i;
        const cur = loading ? 0 : t?.curHelpers || 0;
        const req = loading ? 0 : t?.helpersReq || 0;
        const isFull = !loading && cur >= req;
        const isBusy = !loading && t?._id ? busyIds.has(t._id) : false;

        return (
          <div key={id} className="card feed-card">
            <div className="feed-header">
              <div className="feed-poster">
                {loading ? (
                  <div className="skeleton skeleton-text short" />
                ) : (
                  <Link to={`/users/${t?.postedBy?._id}`} className="btn glossy tiny poster-link">
                    by 👤 {t?.postedBy?.fullName || "Unknown"}
                  </Link>
                )}
                <span className="feed-date">
                  ✍️{t?.createdAt
                    ? new Date(t.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <span className={`priority-badge ${t?.priority?.toLowerCase() || ""}`}>
                {t?.priority || "—"}
              </span>
            </div>

            <div className="feed-body">
              <h3 className="feed-title">
                {loading ? (
                  <div className="skeleton skeleton-text" />
                ) : (
                  t?.taskName || "Undefined"
                )}
              </h3>
              <span className="feed-description">
                {loading ? (
                  <div className="skeleton skeleton-text long" />
                ) : (
                  t?.taskDescription || "No description provided."
                )}
              </span>
                <br/>
              <div className="feed-meta">
                <span className="skill-pill">📍 {t?.location || "—"}</span>
                <span className="skill-pill">
                  👥 {cur}/{req} helpers
                </span>
                <span className="skill-pill">💰 {t?.credits || 0} credits</span>
                <span className="skill-pill">🎯 {t?.date
                    ? new Date(t.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}</span>
                    {!loading ? (
                      <button
                        onClick={() => t && onAccept?.(t)}
                        className="btn glossy primary"
                        disabled={isBusy || isFull || !userId}
                        aria-busy={isBusy}
                      >
                        {isBusy ? "..." : isFull ? "Full" : "Accept"}
                      </button>
                    ) : (
                      <div className="skeleton skeleton-btn" />
                    )}
              </div>
            </div>

              
          </div>
        );
      })}

      {!loading && tasks.length === 0 && (
        <p className="empty-feed">No tasks found 😢</p>
      )}

      <style>{`
        .feed-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .feed-card {
          display: flex;
          flex-direction: column;
          gap: 0rem;
        }
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .feed-poster {
          display: flex;
          flex-direction: column;
          font-size: 0.9rem;
          color: #374151;
        }
        .poster-link {
          font-weight: 1000;
          color: #2563eb;
        }
        .feed-date {
          font-size: 0.8rem;
          color: #6b7280;
        }
        .priority-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .priority-badge.low { background: #d1fae5; color: #065f46; }
        .priority-badge.medium { background: #fef3c7; color: #92400e; }
        .priority-badge.high { background: #fee2e2; color: #991b1b; }

        .feed-body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .feed-title {
          font-size: 1.1rem;
          font-weight: 600;
        }
        .feed-description {
          font-size: 0.95rem;
          color: #374151;
        }
        .feed-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.9rem;
          color: #4b5563;
        }
        .feed-actions {
          display: flex;
          justify-content: flex-end;
        }
        .empty-feed {
          text-align: center;
          color: #6b7280;
          margin-top: 2rem;
        }

        /* Skeleton loaders */
        .skeleton {
          background: rgba(0,0,0,0.08);
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        .skeleton-text { height: 12px; width: 100px; }
        .skeleton-text.long { width: 80%; height: 14px; }
        .skeleton-text.short { width: 60px; }
        .skeleton-btn { width: 80px; height: 30px; border-radius: 6px; }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default TaskTable;