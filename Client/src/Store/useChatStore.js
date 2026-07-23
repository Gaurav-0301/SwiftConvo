import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [], 
  users: [],
  selectedUser: null,
  isUsersLoading: false, 
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/msg/getusers");
      set({ users: res.data.data });
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/msg/getmessages/${userId}`);
    
      set({ messages: res.data });
    } catch (error) {
      console.log("getMessage in useChatStore error", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/msg/sendmessages/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      
      if (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) return;
      
      set({
        messages: [...get().messages, newMessage], 
      });
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));