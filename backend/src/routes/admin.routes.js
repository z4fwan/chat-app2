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

router.use(protectRoute, requireAdmin);

router.get("/users", getAllUsers);
router.put("/block/:id", toggleBlockUser);
router.put("/verify/:id", verifyUser);
router.delete("/delete/:id", deleteUser);

// Optional test route
router.get("/test", (req, res) => res.send("Admin route working ✅"));

export default router;

