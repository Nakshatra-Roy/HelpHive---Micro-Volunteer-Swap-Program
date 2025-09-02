// server/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import { registerChatHandlers } from './socketHandlers.js';


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set('socketio', io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    }
  });

  registerChatHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("MongoDB Connected");
  server.listen(process.env.PORT || 5001, () => {
    console.log("Connection Successful: Server is running on port " + (process.env.PORT || 5001));
  });
})
.catch((err) => console.error("DB Connection Error:", err));