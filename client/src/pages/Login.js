import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // We get the error state directly from the context now
  const { login, user, loading, error } = useAuth();
  
  // This hook now correctly handles navigation after a successful login
  useEffect(() => {
    if (user) {
      navigate('/profile'); // Navigate to profile on successful login
    }
  }, [user, navigate]);

  // The submit handler is now much simpler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Display the error message directly from the context */}
          {error && (
            <div style={{ color: "#e53e3e", marginBottom: "10px", textAlign: "center" }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>
            Don't have an account?{" "}
            <span className="login-link" onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;