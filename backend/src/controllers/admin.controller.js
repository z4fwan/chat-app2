import User from "../models/user.model.js";

// ✅ Get all users (excluding password)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Block or unblock a user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isBlocked ? "blocked" : "unblocked"}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling block" });
  }
};

// ✅ Verify or unverify a user
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isVerified ? "verified" : "unverified"}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling verification" });
  }
};

// ✅ Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
