import React, { useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001');

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
