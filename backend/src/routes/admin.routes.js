import express from "express";

// ✅ Import middleware
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

// ✅ Import controllers
import {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  verifyUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ✅ Public test route
router.get("/test", (req, res) => res.send("Admin route working ✅"));

// ✅ Protect all routes below (only admins allowed)
router.use(protectRoute, requireAdmin);

// ✅ Admin routes
router.get("/users", getAllUsers);
router.put("/block/:id", toggleBlockUser);
router.put("/verify/:id", verifyUser);
router.delete("/delete/:id", deleteUser);

export default router;

