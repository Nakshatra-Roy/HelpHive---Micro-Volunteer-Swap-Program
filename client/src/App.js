import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/socketProvider";

import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';


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
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Regular User Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/offers/new" element={<CreateOffer />} />
        <Route path="/tasks/new" element={<CreateTask />} />
        <Route path="/tasks" element={<ViewTasks />} />
        <Route path="/offers" element={<ViewOffers />} />
        
        {/* Admin Routes */}
        {/* We removed the confusing /admin/profile route. The dashboard IS the admin's profile. */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </div>
    </>
  );
}

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </SocketProvider>
  );
}

//<Toaster position="top-right" />

export default App;