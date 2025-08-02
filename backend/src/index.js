import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// Setup __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Config for Render
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. https://chat-app2-1-ffffffrnt.onrender.com
    credentials: true,
  })
);

console.log("✅ CORS allowed origin:", process.env.CLIENT_URL);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Start server and connect DB
server.listen(PORT, () => {
  console.log(`✅ Server running on PORT: ${PORT}`);
  connectDB();
});
