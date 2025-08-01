import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  verifyUser,
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ✅ Move test route before protectRoute middleware
router.get("/test", (req, res) => res.send("Admin route working ✅"));

// ✅ All routes below require admin access
router.use(protectRoute, requireAdmin);

router.get("/users", getAllUsers);
router.put("/block/:id", toggleBlockUser);
router.put("/verify/:id", verifyUser);
router.delete("/delete/:id", deleteUser);

export default router;
