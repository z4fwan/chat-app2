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
      setSelectedImg(imageUrl); // This updates the local preview (optional)
      await updateProfile({ profilePic: imageUrl }); // This sends to backend
      toast.success("Profile picture updated!");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error("Upload failed");
  }
};

