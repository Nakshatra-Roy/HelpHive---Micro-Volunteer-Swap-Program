// server/server.js
import app from './app.js';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { registerChatHandlers } from './socketHandlers.js'; // <-- Import from the NEW server-side file

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// THIS IS THE ONLY io.on('connection') BLOCK
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Set up the generic handlers
  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Set up the chat-specific handlers by calling our imported function
  registerChatHandlers(io, socket);

  // Set up the disconnect handler
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// --- Database and Server Startup ---
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("MongoDB Connected");
  server.listen(process.env.PORT || 5001, () => {
    console.log("Connection Successful: Server is running on port " + (process.env.PORT || 5001));
  });
})
.catch((err) => console.error("DB Connection Error:", err));