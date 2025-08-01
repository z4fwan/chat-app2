import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.routes.js";

import User from "./models/user.model.js"; // ✅ For /make-me-admin

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app2-1-ffffffrnt.onrender.com",
];

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ TEMP: Promote your user to admin
app.get("/make-me-admin", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: "zn4.studio@gmail.com" },
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "You are now admin", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Test if server is working
app.get("/api/test", (req, res) => {
  res.send("Simple test route working ✅");
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

