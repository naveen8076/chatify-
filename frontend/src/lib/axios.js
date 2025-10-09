// frontend/src/lib/axios.js  (or wherever your axios instance lives)
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const baseURL = API_BASE.replace(/\/$/, ""); // remove trailing slash if any

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // keep if you rely on cookies/sessions
});
