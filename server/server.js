const app = require('./app');
const mongoose = require('mongoose');
const http = require('http'); 
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// create a http server, then give the server access to whole app
// give socket access to the server. this way the socket listens in to any changes to the server

module.exports.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// When someone connects → log them in
// When they “register” with a userId → put them in their own personal room
// When they disconnect → log it out

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("MongoDB Connected");
  server.listen(process.env.PORT || 5001, () => {
    console.log("Connection Successful: Server is running");
  });
})
.catch((err) => console.error("DB Connection Error:", err));