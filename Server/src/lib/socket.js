const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin static assets)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const userSocketMap = {};

function getReceiverSocketId(userId) {
  if (!userId) return undefined;
  return userSocketMap[userId.toString()];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined" && userId !== "null") {
    userSocketMap[userId.toString()] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId && userId !== "undefined" && userId !== "null") {
      delete userSocketMap[userId.toString()];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, getReceiverSocketId };