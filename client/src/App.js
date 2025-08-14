import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";


import Admin from "./pages/Admin";
import CreateOffer from "./pages/CreateOffer";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import ViewOffers from "./pages/ViewOffers";

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/offers/new" element={<CreateOffer />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks" element={<ViewTasks />} />
        <Route path="/offers" element={<ViewOffers />} />
      </Routes>
    </div>
    </>
  );
}

function App() {
  return (
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
  );
}

export default App;