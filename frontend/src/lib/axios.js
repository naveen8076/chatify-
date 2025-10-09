// frontend/src/lib/axios.js
import axios from "axios";
export const axiosInstance = api; // backward compatibility alias

const API_RAW = import.meta.env.VITE_API_URL || "http://localhost:5000"; // e.g. https://buzzchat-29gn.onrender.com/api
export const API_BASE = API_RAW.replace(/\/$/, "");        // remove trailing slash
export const SOCKET_BASE = API_BASE.replace(/\/api$/, ""); // e.g. https://buzzchat-29gn.onrender.com

// axios instance that sends cookies (httpOnly token cookie) to backend
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // required to send HttpOnly cookie to backend
});

// Optional: attach Bearer token from localStorage if you also support header auth
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token"); // optional fallback
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
