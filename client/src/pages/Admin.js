import React, { useEffect, useState } from "react";

import "./Landing.css";

function useFetch(url, initial = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!url) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const json = await res.json();
        if (alive) setData(json);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [url]);

  return { data, loading, error };
}

function Admin() {
  const { data: users, loading } = useFetch(`/api/users/`, []);
  const [list, setList] = useState([]);
  const [flagPending, setFlagPending] = useState(new Set());
  const [statusPending, setStatusPending] = useState(new Set());
  const [rolePending, setRolePending] = useState(new Set());

  useEffect(() => {
    setList(users || []);
  }, [users]);

  const handleToggleFlag = async (user) => {
    if (!user?._id) return;
    const id = user._id;
    const nextFlag = !Boolean(user.flag);

    setFlagPending(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag: nextFlag }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setList(prev => prev.map(u => (u._id === id ? { ...u, flag: nextFlag } : u)));
      alert(nextFlag ? "User flagged successfully" : "User unflagged successfully");
    } catch {
      alert("Error toggling flag");
    } finally {
      setFlagPending(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleToggleDeactivate = async (user) => {
    if (!user?._id) return;
    const id = user._id;
    const isInactive = user.accountStatus === "inactive";
    const nextStatus = isInactive ? "active" : "inactive";

    setStatusPending(prev => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus: nextStatus }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setList(prev => prev.map(u => (u._id === id ? { ...u, accountStatus: nextStatus } : u)));
      alert(nextStatus === "inactive" ? "User deactivated successfully" : "User activated successfully");
    } catch {
      alert("Error updating account status");
    } finally {
      setStatusPending(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleChangeRole = async (user, newRole) => {
    if (!user?._id) return;
    if (!["admin", "user", "volunteer"].includes(newRole)) return;

    const id = user._id;
    const prevRole = user.role || "user";
    if (prevRole === newRole) return;

    setRolePending(prev => new Set(prev).add(id));
    setList(prev => prev.map(u => (u._id === id ? { ...u, role: newRole } : u)));

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      alert(`Role updated to ${newRole}`);
    } catch {
      // revert on failure
      setList(prev => prev.map(u => (u._id === id ? { ...u, role: prevRole } : u)));
      alert("Error updating role");
    } finally {
      setRolePending(prev => {
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
            <h2>All User Details</h2>
          </div>

          <div className="card glass">
            <div className="table">
              <div className="row head">
                <div>#</div>
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Actions</div>
              </div>

              {(loading ? Array.from({ length: 8 }) : list).map((u, i) => {
                const isFlagged = !!u?.flag;
                const isInactive = u?.accountStatus === "inactive";
                const isFlagBusy = u?._id ? flagPending.has(u._id) : false;
                const isStatusBusy = u?._id ? statusPending.has(u._id) : false;
                const isRoleBusy = u?._id ? rolePending.has(u._id) : false;

                return (
                  <div
                    className={`row ${loading ? "skeleton" : ""}`}
                    key={u?._id || i}
                    style={{ position: "relative", opacity: isInactive && !loading ? 0.85 : 1 }}
                  >
                    <div>{i + 1}</div>

                    <div className="user">
                      <div className="avatar">
                        {u?.firstName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span>{u?.firstName} {u?.lastName}</span>
                    </div>

                    <div>{u?.email}</div>

                    <div>
                      {!loading ? (
                        <div className="role-select-wrap">
                          <select
                            className="role-select"
                            value={u?.role || "user"}
                            onChange={(e) => handleChangeRole(u, e.target.value)}
                            disabled={isRoleBusy}
                            aria-busy={isRoleBusy}
                          >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="volunteer">Volunteer</option>
                          </select>
                          {isRoleBusy && <span className="role-spinner">…</span>}
                        </div>
                      ) : (
                        <div className="pill">—</div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <button
                        onClick={() => u && handleToggleFlag(u)}
                        className="btn glossy ghost"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        disabled={loading || isFlagBusy}
                        aria-busy={isFlagBusy}
                      >
                        {isFlagBusy ? "..." : isFlagged ? "Unflag" : "Flag"}
                      </button>

                      <button
                        onClick={() => u && handleToggleDeactivate(u)}
                        className="btn glossy primary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.8rem",
                          background: !isInactive ? "#f87171" : undefined
                        }}
                        disabled={loading || isStatusBusy}
                        aria-busy={isStatusBusy}
                      >
                        {isStatusBusy ? "..." : isInactive ? "Activate" : "Deactivate"}
                      </button>
                    </div>

                    <div className="user-hover-info">
                      <p><strong>Location:</strong> {u?.location || "—"}</p>
                      <p><strong>Bio:</strong> {u?.bio || "—"}</p>
                      <p><strong>Availability:</strong> {u?.availability || "—"}</p>
                      <p><strong>Skills:</strong> {u?.skills?.join(", ") || "—"}</p>
                      <p><strong>Interests:</strong> {u?.interests?.join(", ") || "—"}</p>
                      <p>
                        <strong>Social:</strong>{" "}
                        {u?.socialLinks?.github && (<a href={u.socialLinks.github} target="_blank" rel="noreferrer">GH</a>)}{" "}
                        {u?.socialLinks?.linkedin && (<>| <a href={u.socialLinks.linkedin} target="_blank" rel="noreferrer">LI</a></>)}{" "}
                        {u?.socialLinks?.twitter && (<>| <a href={u.socialLinks.twitter} target="_blank" rel="noreferrer">TW</a></>)}{" "}
                        {u?.socialLinks?.website && (<>| <a href={u.socialLinks.website} target="_blank" rel="noreferrer">WB</a></>)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .row:hover .user-hover-info { display: block; }
          .user-hover-info {
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
            max-width: 300px;
          }
          .btn[disabled] { opacity: 0.6; cursor: not-allowed; }

          /* Glassy role select styling */
          .role-select-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
          }
          .role-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            padding: 8px 32px 8px 10px;
            border-radius: 999px;
            border: 1px solid var(--border);
            background: rgba(16, 185, 129, 0.08);
            color: var(--text);
            font-weight: 600;
            letter-spacing: .2px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(8px);
          }
          /* caret */
          .role-select-wrap::after {
            content: "▾";
            position: absolute;
            right: 10px;
            color: #047857;
            pointer-events: none;
            font-size: 12px;
            opacity: 0.9;
          }
          .role-select:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .role-spinner {
            margin-left: 8px;
            color: #047857;
            font-weight: 800;
            opacity: 0.8;
          }
        `}
      </style>
    </>
  );
}

export default Admin;