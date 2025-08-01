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

  if (!authUser) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="h-screen pt-20 text-white bg-black">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <div className="relative mb-4">
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

          {/* Display Info */}
          <div className="mt-4 text-center space-y-2">
            <p className="text-lg font-bold">@{authUser.username}</p>
            <p className="text-gray-400">{authUser.email}</p>
            {authUser.fullName && <p className="text-gray-300">{authUser.fullName}</p>}
            {authUser.bio && <p className="text-gray-400 italic">"{authUser.bio}"</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

