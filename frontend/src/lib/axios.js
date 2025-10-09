import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === https://buzzchat-zgwz.onrender.com/,
  withCredentials: true,
});
