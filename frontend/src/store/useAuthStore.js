// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import { api, SOCKET_BASE } from "../lib/axios"; // use updated axios setup
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // ------------------ AUTH CHECK ------------------
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ------------------ SIGNUP ------------------
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ------------------ LOGIN ------------------
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ------------------ LOGOUT ------------------
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  // ------------------ UPDATE PROFILE ------------------
  updateProfile: async (data) => {
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  },

  // ------------------ SOCKET CONNECTION ------------------
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(SOCKET_BASE, {
      path: "/socket.io",
      withCredentials: true, // send cookies for auth
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },
}));
