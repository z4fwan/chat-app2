export const uploadToCloudinary = async (base64Image) => {
  const data = new FormData();
  data.append("file", base64Image);
  data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const res = await fetch("https://api.cloudinary.com/v1_1/" + import.meta.env.VITE_CLOUDINARY_CLOUD_NAME + "/image/upload", {
    method: "POST",
    body: data,
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.error?.message || "Image upload failed");

  return result.secure_url;
};
