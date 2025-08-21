import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      await axios.post(
        "http://localhost:5001/api/users",
        {
          firstName,
          lastName,
          email,
          password,
          bio,
          location,
          skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
          following: following.split(",").map((item) => item.trim()).filter(Boolean),
          availability,
          socialLinks,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      window.alert("User created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      window.alert("Error creating user. Check console for details.");
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Backdrop same as login */}
      <div className="backdrop">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid-overlay" />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "64px 0" }}>
        <div className="container section" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card glass" style={{ padding: "32px", borderRadius: "16px" }}>
            <h2 className="hero-title" style={{ textAlign: "center", marginBottom: 24 }}>
              Create Your <span style={{ color: "#065f46" }}>HELP HIVE</span> Account
            </h2>

            <form onSubmit={handleSubmit} className="grid" style={{ gap: 16 }}>
              <h4 style={{ marginTop: 8 }}>Profile Details</h4>
              <input
                type="text"
                className="card input-full"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <input
                type="text"
                className="card input-full"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <input
                type="email"
                className="card input-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="card input-full"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                className="card input-full"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <textarea
                className="card input-full"
                placeholder="About you (this will be visible to everyone)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />

              <input
                type="text"
                className="card input-full"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                type="text"
                className="card input-full"
                placeholder="Skills (e.g. Gardening, Tutoring)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <input
                type="text"
                className="card input-full"
                placeholder="Need help with (e.g. Babysitting)"
                value={following}
                onChange={(e) => setFollowing(e.target.value)}
              />

              <input
                type="text"
                className="card input-full"
                placeholder="Availability (e.g. Weekends, Evenings)"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />

              <h4 style={{ marginTop: 8 }}>Social Links</h4>
              <input
                type="text"
                className="card input-full"
                placeholder="GitHub"
                value={socialLinks.github}
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
              />
              <input
                type="text"
                className="card input-full"
                placeholder="LinkedIn"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              />
              <input
                type="text"
                className="card input-full"
                placeholder="Twitter"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              />
              <input
                type="text"
                className="card input-full"
                placeholder="Website"
                value={socialLinks.website}
                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
              />

              <button type="submit" className="btn glossy primary" style={{ width: "100%" }}>
                ✨ Sign Up
              </button>

              <p className="hint" style={{ textAlign: "center", marginTop: 8 }}>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;