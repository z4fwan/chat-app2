import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"; // socket.js should export app & server
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import User from "./models/user.model.js";

// ✅ Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5001;

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Dev
      "https://z-app-official-frontend.onrender.com" // Prod
    ],
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // On Render, frontend is built into backend/dist
  const frontendPath = path.join(__dirname, "./dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ✅ Create default admin if not exists
const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn("⚠️ ADMIN_EMAIL not set in .env");
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("safwan123", 10); // Change password if needed
      await User.create({
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        isVerified: true,
      });
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log("ℹ️ Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Failed to create default admin:", error.message);
  }
};

// ✅ Start server
server.listen(PORT, async () => {
  await connectDB();
  await createDefaultAdmin();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
