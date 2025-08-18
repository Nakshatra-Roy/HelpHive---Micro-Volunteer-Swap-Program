import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const isLoggedInAdmin = user && user.role === "admin";

  const isActive = (to) => pathname === to;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.6))",
      }}
    >
      <div
        className="container"
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/"
            className="brand"
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
          </Link>

          {isLoggedIn && !isLoggedInAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
              <NavLink to="/tasks" active={isActive("/tasks")}>
                View Tasks
              </NavLink>
              <NavLink to="/offers/new" active={isActive("/offers/new")}>
                Create Offer
              </NavLink>
              <NavLink to="/tasks/new" active={isActive("/tasks/new")}>
                Create Task
              </NavLink>
            </div>
          )}

          {isLoggedInAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
              <h3 style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 800,
              letterSpacing: ".3px",
              color: "#ff0000ff",
              textDecoration: "none",
              fontSize: "1rem",
              textTransform: "uppercase",
            }} >Admin</h3>
              <NavLink to="/tasks" active={isActive("/tasks")}>
                View Tasks
              </NavLink>
              <NavLink to="/admin" active={isActive("/admin")}>
                Users
              </NavLink>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isLoggedIn ? (
            <>
                <>
                  <button
                    onClick={() => navigate(isLoggedInAdmin ? '/admin/dashboard' : '/profile')}
                    className="btn glossy primary"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "9999px",
                      background: "linear-gradient(to right, #34d399, #10b981)",
                      color: "#ffffff",
                      fontWeight: 700,
                      border: "none",
                      textDecoration: "none",
                      transition: "all 0.3s",
                      boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                    }}
                  >
                    Dashboard
                  </button>
                </>

              <button
                onClick={handleLogout}
                className="btn glossy primary"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  background: "linear-gradient(to right, #ef4444, #b91c1c)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(185, 28, 28, 0.2)",
                  marginLeft: "8px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn glossy ghost"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  border: "1px solid #a7f3d0",
                  background: "transparent",
                  color: "#047857",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s",
                }}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn glossy primary"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  background: "linear-gradient(to right, #34d399, #10b981)",
                  color: "#ffffff",
                  fontWeight: 700,
                  border: "none",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: active ? "#065f46" : "#6ee7b7",
        fontWeight: active ? 800 : 600,
        padding: "8px 12px",
        borderRadius: 10,
        border: active ? "1px solid #a7f3d0" : "1px solid transparent",
        background: active ? "linear-gradient(180deg, #d1fae5, #bbf7d0)" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </Link>
  );
}

export default Navbar;