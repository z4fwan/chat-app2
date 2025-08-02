import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"                  // ✅ Dev server
      : import.meta.env.VITE_API_BASE_URL,           // ✅ Prod server (do not append `/api`)
  withCredentials: true,                             // ✅ Send cookies (JWT)
});
