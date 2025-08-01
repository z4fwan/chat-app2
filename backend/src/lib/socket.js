import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app2-1-ffffffrnt.onrender.com"
    ],
    credentials: true,
  },
});

// ✅ Used to store online users { userId: socketId }
const userSocketMap = {};

// ✅ Helper to get a socket ID by user ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ✅ Socket connection listener
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User ID registered:", userId);
  }

  // 🔄 Broadcast online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Listen for messages being sent
  socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }
  });

  // ❌ Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

