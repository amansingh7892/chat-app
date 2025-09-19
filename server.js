const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    socket.roomId = roomId;
    socket.emit("chat message", "You joined the room."); // info only for sender
    socket.to(roomId).emit("chat message", "A new user joined the room."); // notify others
  });

  // Listen for messages
  socket.on("chat message", ({ roomId, message }) => {
    // Broadcast to **all users including sender**, but mark sender messages on client
    io.to(roomId).emit("chat message", { message, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
