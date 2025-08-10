import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.js";

import "./App.css";
import Landing from "./pages/Landing";
// You can import more pages here:
// import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}>
        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<Landing />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;