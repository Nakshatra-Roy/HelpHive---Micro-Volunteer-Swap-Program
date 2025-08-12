import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [availability, setAvailability] = useState("");
  const [socialLinks, setSocialLinks] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5001/api/users", // ✅ point to your backend
      {
        firstName,
        lastName,
        email,
        password,
        bio,
        location,
        skills,
        interests,
        availability,
        socialLinks,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    window.alert("User created successfully");
    navigate("/login");

  } catch (err) {
    console.error(err);
    window.alert("Error creating user. Check console for details.");
  }
};


  return (
    <div className="signup-container">
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
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="required-field">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="required-field">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="required-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="required-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="required-field">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            style={{
              marginBottom: "16px",
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
            }}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <input
            type="text"
            placeholder="Interests (comma separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <input
            type="text"
            placeholder="Availability (e.g. Weekends, Evenings)"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <input
            type="text"
            placeholder="Social Links (comma separated URLs)"
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
          />

          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{" "}
            <span className="signup-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
