import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  verifyUser,
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // ✅ corrected path
import { requireAdmin } from "../middleware/adminMiddleware.js"; // ✅ corrected path

const router = express.Router();

// ✅ Public route for testing
router.get("/test", (req, res) => res.send("Admin route working ✅"));

// ✅ Protect all routes below
router.use(protectRoute, requireAdmin);

router.get("/users", getAllUsers);
router.put("/block/:id", toggleBlockUser);
router.put("/verify/:id", verifyUser);
router.delete("/delete/:id", deleteUser);

export default router;
