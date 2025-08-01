import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      const imageUrl = data.secure_url;

      if (imageUrl) {
        setSelectedImg(imageUrl);
        await updateProfile({ profilePic: imageUrl });
        toast.success("Profile picture updated!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={selectedImg || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border shadow-md"
            />
            <label htmlFor="profilePicInput" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
              <Camera className="w-5 h-5 text-gray-700" />
            </label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

