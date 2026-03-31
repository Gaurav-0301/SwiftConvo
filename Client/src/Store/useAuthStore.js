import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } // useAuthStore.js
catch (error) {
  
  const errorMessage = error.response?.data?.message || "An error occurred";
  toast.error(errorMessage);
  console.log("Signup error details:", error.response?.data);
}finally {
      set({ isSignUp: false });
    }
  },

  logout:async()=>{
    try {
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logout successfully !!")
    } catch (error) {
        console.log("Logout error in useAuthStore ",error);
    }
  },
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successfully");
    } // useAuthStore.js
catch (error) {
  
  const errorMessage = error.response?.data?.message || "An error occurred";
  toast.error(errorMessage);
  console.log("Signup error details:", error.response?.data);
}finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile:async(profilePic)=>{
    set({isUpdatingProfile:true});
    try {
      const res=await axiosInstance.put("/auth/updateprofile",profilePic);
      set({authUser:res.data});
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.log("updateProfile error in useAuthStore.." , error.response?.data)
    }finally{
      set({isUpdatingProfile:false});
    }
  }

}));