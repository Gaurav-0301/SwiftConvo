const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const authRouter = require("./src/routes/auth.route");
const messageRouter = require("./src/routes/message.route");
const { connectDB } = require("./src/config/db");
const cors = require("cors");
const { app, server } = require("./src/lib/socket");
const friendsRouter = require("./src/routes/friends.route");

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, same-origin static assets)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/auth", authRouter);
app.use("/msg", messageRouter);
app.use("/friends", friendsRouter);

// Serve static frontend assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Client/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 2724;
server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});