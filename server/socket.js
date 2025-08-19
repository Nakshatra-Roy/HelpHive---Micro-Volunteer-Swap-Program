// socket/index.js
import { registerChatHandlers } from './chatHandlers.js';
import { registerNotificationHandlers } from './notificationHandlers.js'; // Example for the future

export const onConnection = (io, socket) => {
  console.log("User connected:", socket.id);

  // --- Register ALL handler groups here ---
  
  // Handlers for user-specific rooms (notifications, status updates, etc.)
  socket.on('joinNotificationRoom', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined notification room for user: ${userId}`);
  });

  // Handlers for the chat feature
  registerChatHandlers(io, socket);

  // Example: Handlers for a future notification feature could go here
  // registerNotificationHandlers(io, socket);

  // Generic disconnect handler
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};