import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, user, loading, error } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/');
    } else {
      setErrorMessage(error || "Login failed. Please try again.");
    }
  };


  return (
    <div className="login-container">
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "24px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 800,
            letterSpacing: ".3px",
            color: "#059669",
            textDecoration: "none",
            fontSize: "1.5rem",
            textTransform: "uppercase",
          }}
          aria-label="HelpHive Home"
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #bbf7d0, #34d399)",
              boxShadow: "0 6px 16px rgba(16,185,129,0.25)",
              display: "grid",
              placeItems: "center",
              color: "#064e3b",
              fontWeight: 900,
            }}
          >
            💡
          </span>
          HELP HIVE
        </a>
      </div>
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
          <button type="submit">Login</button>
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