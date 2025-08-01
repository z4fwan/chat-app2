import express from "express";
import { getAllUsers, toggleBlockUser, deleteUser, verifyUser } from "../controllers/admin.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// All admin routes are protected + admin-only
router.use(protectRoute, requireAdmin);

router.get("/users", getAllUsers); // ✅ Get all users
router.put("/block/:id", toggleBlockUser); // ✅ Block/unblock user
router.put("/verify/:id", verifyUser); // ✅ Verify/unverify user
router.delete("/delete/:id", deleteUser); // ✅ Delete user

export default router;
