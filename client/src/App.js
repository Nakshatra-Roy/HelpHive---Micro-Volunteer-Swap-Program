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
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ChatPage from './pages/ChatPage';

import AdminUsers from "./pages/AdminUsers";
import CreateOffer from "./pages/CreateOffer";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import ViewOffers from "./pages/ViewOffers";

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Chat Route - Full Width */}
        <Route path="/chat/:taskId" element={<ChatPage />} />
        
        {/* All Other Routes - With Container */}
        <Route path="/" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Landing /></div>} />
        <Route path="/login" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Login /></div>} />
        <Route path="/signup" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Signup /></div>} />

        {/* Regular User Routes */}
        <Route path="/profile" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ProfilePage /></div>} />
        <Route path="/offers/new" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><CreateOffer /></div>} />
        <Route path="/tasks/new" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><CreateTask /></div>} />
        <Route path="/tasks" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ViewTasks /></div>} />
        <Route path="/offers" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ViewOffers /></div>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><AdminRoute><AdminDashboard /></AdminRoute></div>} />
        <Route path="/admin/users" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><AdminRoute><AdminUsers /></AdminRoute></div>} />
      </Routes>
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