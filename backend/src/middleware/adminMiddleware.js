// middleware/adminMiddleware.js
import User from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
  try {
    // Ensure req.user exists from protectRoute middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Fetch user from DB to get isAdmin field
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check isAdmin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Optional: attach admin user for further usage
    req.adminUser = user;

    next(); // ✅ Allow access
  } catch (error) {
    console.error("Admin check failed:", error.message);
    res.status(500).json({ message: "Server error during admin check" });
  }
};
