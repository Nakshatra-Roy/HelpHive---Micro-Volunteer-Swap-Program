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
  const [following, setFollowing] = useState("");
  const [availability, setAvailability] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    website: ""
  });

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
        skills: skills.split(',').map(item => item.trim()).filter(Boolean),
        following: following.split(',').map(item => item.trim()).filter(Boolean),
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
            placeholder="Following (comma separated)"
            value={following}
            onChange={(e) => setFollowing(e.target.value)}
          />
          <input
            type="text"
            placeholder="Availability (e.g. Weekends, Evenings)"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <div className="social-links-container">
            <h4>Social Links</h4>
            <input
              type="text"
              placeholder="GitHub"
              value={socialLinks.github}
              onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
            />
            <input
              type="text"
              placeholder="LinkedIn"
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
            />
            <input
              type="text"
              placeholder="Twitter"
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
            />
            <input
              type="text"
              placeholder="Website"
              value={socialLinks.website}
              onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
            />
          </div>

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
