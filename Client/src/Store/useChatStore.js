import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useChatStore=create((set)=>({
 
    message:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,


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

    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosInstance.get(`/msg/getMessages/${userId}`);
            set({messages:res.data});

        } catch (error) {
            console.log("getMessage is useChatStore error");
           toast.error(error.response.data.message);
        }finally{
             set({isMessagesLoading:false});
        }
    },

    // optimize this one later
    setSelectedUser:(selectedUser)=>set({selectedUser}),

}));