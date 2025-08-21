import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./style.css"

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
        if (alive) setData(json?.items || json || []);
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

function Landing() {
  const { data: tasks, loading: loadingTasks } = useFetch(
    API_BASE ? `${API_BASE}/api/tasks?limit=6` : null,
    []
  );
  const { data: helpers, loading: loadingHelpers } = useFetch(
    API_BASE ? `${API_BASE}/api/helpers?limit=8` : null,
    []
  );

  const topTasks = useMemo(() => Array.isArray(tasks) ? tasks.slice(0, 6) : [], [tasks]);
  const topHelpers = useMemo(() => Array.isArray(helpers) ? helpers.slice(0, 8) : [], [helpers]);

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

      {/* Tasks preview */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Recent Tasks</h2>
            <Link to="/tasks" className="btn tiny ghost">View all →</Link>
          </div>
          <div className="grid cards cols-3">
            {(loadingTasks ? Array.from({ length: 6 }) : topTasks).map((t, i) => (
              <Link
                to={`/tasks/${t?.slug || t?._id || "#"}`}
                className={`card glass hover-lift ${loadingTasks ? "skeleton" : ""}`}
                key={t?._id || i}
              >
                <div className="card-head">
                  <span className="badge code">{(t?.category || "Task").toUpperCase()}</span>
                  <span className="pill">{t?.location || "Nearby"}</span>
                </div>
                <h3 className="card-title">{t?.title || "Loading…"}</h3>
                <p className="card-sub">
                  {(t?.tags || ["urgent", "outdoor", "friendly"]).slice(0, 3).map((tag, j) => (
                    <span className="tag" key={tag}>#{tag}</span>
                  ))}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Helpers preview */}
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>Top Helpers</h2>
            <Link to="/profile" className="btn tiny ghost">Your profile →</Link>
          </div>
          <div className="card glass">
            <div className="table">
              <div className="row head">
                <div>#</div>
                <div>User</div>
                <div>Tasks Completed</div>
                <div>Rating</div>
              </div>
              {(loadingHelpers ? Array.from({ length: 8 }) : topHelpers).map((h, i) => (
                <div className={`row ${loadingHelpers ? "skeleton" : ""}`} key={h?.userId || h?.handle || i}>
                  <div>{i + 1}</div>
                  <div className="user">
                    <div className="avatar">{(h?.handle || "U")[0]?.toUpperCase()}</div>
                    <span>{h?.handle || h?.username || "Loading…"}</span>
                  </div>
                  <div>{h?.completedTasks ?? "—"}</div>
                  <div>{h?.rating ?? "—"}</div>
                </div>
              ))}
            </div>
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
                <Link to="/tasks" className="btn glossy primary">Find Help</Link>
                <Link to="/offers" className="btn glossy ghost" style={{ marginLeft: 8 }}>Offer Help</Link>
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
            <div className="brand">HelpHive</div>
            <div className="muted">Neighbors helping neighbors</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;
