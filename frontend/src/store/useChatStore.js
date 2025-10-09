// src/store/useChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  _socketHandler: null, // internal socket handler reference

  // ---------------- SOUND TOGGLE ----------------
  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", next);
    set({ isSoundEnabled: next });
  },

  // ---------------- BASIC UI STATE ----------------
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser, messages: [] }),

  // ---------------- FETCH CONTACTS / CHATS ----------------
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ---------------- FETCH MESSAGES ----------------
  getMessagesByUserId: async (userId) => {
    if (!userId) {
      set({ messages: [] });
      return;
    }
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const sorted = Array.isArray(res.data)
        ? res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];
      set({ messages: sorted });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ---------------- SEND MESSAGE ----------------
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return;

    const tempId = `temp-${Date.now()}`;

    // optimistic UI update
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set((state) => ({ messages: [...state.messages, optimisticMessage] }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // replace optimistic message with real one
      set((state) => ({
        messages: state.messages
          .filter((m) => !m.isOptimistic)
          .concat(res.data),
      }));
    } catch (error) {
      // remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => !m.isOptimistic),
      }));
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // ---------------- SOCKET SUBSCRIBE ----------------
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    if (!socket) {
      console.warn("Socket not connected — cannot subscribe to messages.");
      return;
    }

    const handleNewMessage = (newMessage) => {
      // Only add if message belongs to this chat (either sent or received)
      const isRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (!isRelevant) return;

      set((state) => {
        const exists = state.messages.some(
          (m) =>
            (m._id && newMessage._id && m._id === newMessage._id) ||
            (m.clientMessageId &&
              newMessage.clientMessageId &&
              m.clientMessageId === newMessage.clientMessageId)
        );
        if (exists) return state;

        return {
          messages: [...state.messages, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          ),
        };
      });

      // play sound only for received messages
      if (isSoundEnabled && newMessage.senderId === selectedUser._id) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    };

    // Cleanup old and attach fresh listener
    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    set({ _socketHandler: handleNewMessage });
  },

  // ---------------- SOCKET UNSUBSCRIBE ----------------
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const handler = get()._socketHandler;
    if (!socket || !handler) return;
    socket.off("newMessage", handler);
    set({ _socketHandler: null });
  },
}));
