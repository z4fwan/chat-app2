// middleware/adminMiddleware.js

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Admin verified, proceed
  } catch (error) {
    console.error("Admin check failed:", error);
    res.status(500).json({ message: "Server error during admin check" });
  }
};
