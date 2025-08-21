import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user, error } = useAuth();
  
  // This hook now correctly handles navigation after a successful login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

return (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    <div className="backdrop">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="grid-overlay" />
    </div>

    <div style={{ position: "relative", zIndex: 1, padding: "64px 0" }}>
      <div className="container section" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="card glass" style={{ padding: "32px", borderRadius: "16px" }}>
          <h2 className="hero-title" style={{ textAlign: "center", marginBottom: 24 }}>
            Login to <span style={{ color: "#065f46" }}>HELP HIVE</span>
          </h2>

          <form onSubmit={handleLogin} className="grid" style={{ gap: 16 }}>
            <div>
              <input
                type="text"
                className="card input-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="card input-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="card highlight" style={{ color: "#ef4444", padding: "8px" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn glossy primary" style={{ width: "100%" }}>
              🚀 Login
            </button>

            <p className="hint" style={{ textAlign: "center", marginTop: 8 }}>
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Login;