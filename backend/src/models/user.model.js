import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },

    // ✅ Admin panel fields
    isAdmin: {
      type: Boolean,
      default: false, // Only admins will be able to access admin panel
    },
    isBlocked: {
      type: Boolean,
      default: false, // If true, user can't login/chat
    },
    isVerified: {
      type: Boolean,
      default: false, // True means user has a blue badge or verified status
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const User = mongoose.model("User", userSchema);

export default User;

