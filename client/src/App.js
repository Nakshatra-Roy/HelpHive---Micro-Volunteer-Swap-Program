import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from "./context/socketProvider";
import toast, { Toaster } from 'react-hot-toast';
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from './pages/PublicProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ChatPage from './pages/ChatPage';

import AdminUsers from "./pages/AdminUsers";
import AdminLogbook from "./pages/AdminLogbook";
import CreateOffer from "./pages/CreateOffer";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import ViewOffers from "./pages/ViewOffers";
import MyTasks from './pages/MyTasks'; 
import SwapRequests from './pages/SwapRequests'; 
import CalendarView from './pages/CalendarView';

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/chat/:taskId" element={<ChatPage />} />
        
        <Route path="/" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Landing /></div>} />
        <Route path="/login" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Login /></div>} />
        <Route path="/signup" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><Signup /></div>} />

        <Route path="/profile" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ProfilePage /></div>} />
        <Route path="/offers/new" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><CreateOffer /></div>} />
        <Route path="/tasks/new" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><CreateTask /></div>} />
        <Route path="/tasks" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ViewTasks /></div>} />
        <Route path="/offers" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><ViewOffers /></div>} />
        <Route path="/mytasks" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><MyTasks /></div>} />
         <Route 
          path="/swap-requests" 
          element={
            <div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}>
                <SwapRequests />
            </div>
          } 
        />
        <Route path="/calendarview" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><CalendarView /></div>} />
        <Route path="/users/:id" element={<PublicProfilePage />} />
        
        <Route path="/admin/dashboard" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><AdminRoute><AdminDashboard /></AdminRoute></div>} />
        <Route path="/admin/users" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><AdminRoute><AdminUsers /></AdminRoute></div>} />
        <Route path="/admin/logbook" element={<div className="container" style={{ padding: "1rem", position: "relative", zIndex: 1 }}><AdminRoute><AdminLogbook /></AdminRoute></div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
      <AuthProvider>
        <SocketProvider>
        <Router>
          <AppContent />
        </Router>
        </SocketProvider>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </AuthProvider>
    
  );
}

//<Toaster position="top-right" />

export default App;