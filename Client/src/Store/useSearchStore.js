import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useSearchStore = create((set, get) => ({
  searching: false,
  isSendingRequest: false,
  isLoadingRequests: false,
  searchedUser: null,
  relationshipStatus: "none", // "none" | "friends" | "request_sent" | "request_received"
  isSelf: false,
  incomingRequests: [],
  friendsList: [],

  searchUser: async (data) => {
    set({ searching: true, searchedUser: null, relationshipStatus: "none", isSelf: false });
    try {
      const res = await axiosInstance.post("/friends/searchUser", data);
      if (res.data?.success) {
        set({
          searchedUser: res.data.user,
          relationshipStatus: res.data.relationshipStatus || "none",
          isSelf: res.data.isSelf || false,
          searching: false,
        });
        toast.success(res.data.isSelf ? "That's your own UID!" : "User found!");
        return res.data.user;
      } else {
        set({ searching: false });
        toast.error(res.data?.message || "User not found");
        return null;
      }
    } catch (error) {
      set({ searching: false, searchedUser: null });
      const msg = error.response?.data?.message || "No user found with this UID.";
      toast.error(msg);
      return null;
    }
  },

  sendFriendRequest: async (receiverId) => {
    set({ isSendingRequest: true });
    try {
      const res = await axiosInstance.post("/friends/sendRequest", { receiverId });
      if (res.data?.success) {
        toast.success(res.data.message || "Friend request sent!");
        set({ relationshipStatus: "request_sent" });
        return true;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send friend request";
      toast.error(msg);
      return false;
    } finally {
      set({ isSendingRequest: false });
    }
  },

  getFriendRequests: async () => {
    set({ isLoadingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      if (res.data?.success) {
        set({ incomingRequests: res.data.requests || [] });
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/accept/${requestId}`);
      if (res.data?.success) {
        toast.success("Friend request accepted!");
        set((state) => ({
          incomingRequests: state.incomingRequests.filter((r) => r._id !== requestId),
          relationshipStatus: state.searchedUser ? "friends" : state.relationshipStatus,
        }));
        get().getFriendsList();
        useChatStore.getState().getUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.post(`/friends/reject/${requestId}`);
      if (res.data?.success) {
        toast.info("Friend request declined");
        set((state) => ({
          incomingRequests: state.incomingRequests.filter((r) => r._id !== requestId),
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to decline friend request");
    }
  },

  getFriendsList: async () => {
    try {
      const res = await axiosInstance.get("/friends/list");
      if (res.data?.success) {
        set({ friendsList: res.data.friends || [] });
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  },

  subscribeToFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");

    socket.on("newFriendRequest", (newReq) => {
      toast((t) => `${newReq.name} sent you a friend request!`, { icon: "👋" });
      set((state) => {
        if (state.incomingRequests.some((r) => r._id === newReq._id)) return state;
        return { incomingRequests: [newReq, ...state.incomingRequests] };
      });
    });

    socket.on("friendRequestAccepted", (data) => {
      toast.success(`${data.friend?.name || "User"} accepted your friend request!`);
      get().getFriendsList();
      useChatStore.getState().getUsers();
      const currentSearched = get().searchedUser;
      if (currentSearched && currentSearched._id === data.friend?._id) {
        set({ relationshipStatus: "friends" });
      }
    });
  },

  unSubscribeFromFriendEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
  },

  clearSearchedUser: () =>
    set({ searchedUser: null, relationshipStatus: "none", isSelf: false }),
}));