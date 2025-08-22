import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTaskStore } from "../store/taskStore";
import TaskTableLanding from "../components/TaskTableLanding";
import "./style.css";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/+$/, "") || "";

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

const Landing = () => {
  const { tasks, loading, fetchTask, acceptTask } = useTaskStore();
  const { user } = useAuth();
  const [acceptPending, setAcceptPending] = useState(new Set());

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);
  const { data: helpers, loading: loadingHelpers } = useFetch(`/api/users`, []);

  const topHelpers = useMemo(() => {
    if (!Array.isArray(helpers)) return [];
    return [...helpers]
      .sort(
        (a, b) =>
          (b?.volunteerHistory?.length || 0) -
          (a?.volunteerHistory?.length || 0)
      )
      .slice(0, 5);
  }, [helpers]);

  const recentTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return sorted.slice(0, 5);
  }, [tasks]);

  const handleAcceptTask = async (task) => {
    if (!task?._id || !user?._id) return;
    const cur = task.curHelpers || 0;
    const req = task.helpersReq || 0;
    if (cur >= req) {
      alert("This task is already full.");
      return;
    }

    setAcceptPending((prev) => new Set(prev).add(task._id));
    try {
      const { success, message } = await acceptTask(task, user._id);
      if (!success) alert(`Error: ${message}`);
      else alert("Task accepted successfully!");
    } catch {
      alert("Error accepting task");
    } finally {
      setAcceptPending((prev) => {
        const s = new Set(prev);
        s.delete(task._id);
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

      <section className="section hero">
        <div className="container">
          <div className="hero-inner">
            <div className="eyebrow">Hyperlocal Volunteering, Simplified</div>
            <h1 className="hero-title">
              Connect. <span className="shine">Swap help</span>. Build <span className="shine">community</span>.
            </h1>
            <p className="hero-sub">
              HelpHive lets neighbors exchange skills, time, and kindness—no money involved. Post a task, offer a hand, or just be there when someone needs you.
            </p>
            <div className="hero-actions">
              <Link to="/tasks" className="btn glossy primary">View Tasks</Link>
              <Link to="/tasks/new" className="btn glossy ghost">Ask for Help</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">🤝</div>
                <div className="stat-label">Mutual aid, not money</div>
              </div>
              <div className="stat">
                <div className="stat-number">📍</div>
                <div className="stat-label">Built for neighborhoods</div>
              </div>
              <div className="stat">
                <div className="stat-number">✨</div>
                <div className="stat-label">Kindness is currency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tasks */}
      <section className="section">
          <div className="section-head">
            <h2>Recent Tasks</h2>
            <Link to="/tasks" className="btn glossy ghost">
              View all →
            </Link>
          </div>

          <TaskTableLanding
            tasks={recentTasks}
            loading={loading}
            userId={user?._id}
            busyIds={acceptPending}
            onAccept={handleAcceptTask}
            sortOrder="desc"
          />

          {!loading && recentTasks.length === 0 && (
            <p style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
              No tasks found 😢{" "}
              <Link to="/createTask" className="btn tiny under">
                Create a task
              </Link>
            </p>
          )}
      </section>

      {/* Top Helpers */}
      <section className="section">
          <div className="section-head">
            <h2>Top Helpers</h2>
          </div>
          <div className="card glass">
          <div className="table">
            <div className="row head">
              <div>#</div>
              <div>Name</div>
              <div>Tasks Completed</div>
              <div>Rating</div>
            </div>
          {/* ***row spacing needs fixing */}
            {(loadingHelpers ? Array.from({ length: 8 }) : topHelpers).map(
              (h, i) => (
                <div
                  className={`row ${loadingHelpers ? "skeleton" : ""}`}
                  key={h?._id || i}
                >
                  <div>{i + 1}</div>
                  <div className="user">
                    <div className="avatar">
                      {(h?.fullName || "U")[0]?.toUpperCase()}
                    </div>
                    <span>{h?.fullName || "Loading…"}</span>
                  </div>
                  <div>{h?.volunteerHistory?.length ?? "—"}</div>
                  <div>{h?.ratingSummary.average ?? "—"}</div>
                </div>
              )
            )}

            {!loadingHelpers && topHelpers.length === 0 && (
              <p style={{ marginTop: 16, textAlign: "center", color: "#6b7280" }}>
                No helpers found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container">
          <div className="grid cols-2 about">
            <div>
              <h2>Kindness, at your doorstep</h2>
              <p>
                HelpHive makes it easy to give and get help in your local community. Whether you need groceries picked up,
                tutoring for a child, or just a quick fix around the house, someone nearby is ready to lend a hand.
              </p>
              <div className="bullets">
                <div>📌 Post tasks and get notified</div>
                <div>🧑‍🤝‍🧑 Swap help without money</div>
                <div>🌍 Local-first discovery</div>
                <div>💬 Chat & coordinate safely</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Link to="/tasks/new" className="btn glossy primary">Find Help</Link>
                <Link to="/tasks" className="btn glossy ghost" style={{ marginLeft: 8 }}>Offer Help</Link>
              </div>
            </div>
            <div className="card glass highlight">
              <h3 className="card-title">Tip: Give a little, gain a lot</h3>
              <p className="card-sub">
                Start by helping once a week. Small efforts build big community. The more you give, the more trust and warmth you gain in return.
              </p>
              <div className="ladder">
                <div className="rung easy">1 task/week</div>
                <div className="rung medium">3 tasks/week</div>
                <div className="rung hard">Daily champion</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="foot-inner">
            <div className="brand">HELP HIVE</div>
            <div className="muted">Neighbors helping neighbors</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;
