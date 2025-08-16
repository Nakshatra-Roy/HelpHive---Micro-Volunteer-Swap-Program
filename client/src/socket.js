export const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Optional: Join a room with user ID so we can emit directly
    socket.on('join', (userId) => {
      socket.join(userId); // use user._id as room
      console.log(`User joined room: ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
