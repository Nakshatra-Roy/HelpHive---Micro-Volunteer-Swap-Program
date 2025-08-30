// src/context/socketProvider.js
import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

// Initialize socket but do NOT auto-connect
const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001', {
  autoConnect: false,
});

export const SocketProvider = ({ children }) => {
  const { user, loadUser } = useAuth();

  // Setup socket event listeners safely
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');

    // Connect only if not already connected
    if (!socket.connected) {
      socket.auth = { userId: user._id };
      socket.connect();
    }

    // Register user to their private room
    socket.emit('register', user._id);
    console.log(`Registered user ${user._id} with socket`);

    // Socket listeners
    const handleUserFlagged = (data) => {
      toast(data.message, { duration: 5000 });
      if (typeof loadUser === 'function') loadUser(token);
    };

    const handleAccountStatusChanged = (data) => {
      toast(data.message, {
        style: { border: '1px solid #ff0000ff', padding: '16px', color: '#ff0000ff' },
        duration: 5000,
      });
      if (typeof loadUser === 'function') loadUser(token);
    };

    const handleRoleChanged = (data) => {
      toast.success(data.message, { duration: 5000 });
      if (typeof loadUser === 'function') loadUser(token);
    };

    socket.on('connect', () => console.log('✅ Socket connected:', socket.id));
    socket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
    socket.on('connect_error', (err) => console.error('Socket connection error:', err.message));

    socket.on('userFlagged', handleUserFlagged);
    socket.on('accountStatusChanged', handleAccountStatusChanged);
    socket.on('roleChanged', handleRoleChanged);

    return () => {
      socket.off('userFlagged', handleUserFlagged);
      socket.off('accountStatusChanged', handleAccountStatusChanged);
      socket.off('roleChanged', handleRoleChanged);
    };
  }, [user, loadUser]); // Depend on both user and loadUser

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};