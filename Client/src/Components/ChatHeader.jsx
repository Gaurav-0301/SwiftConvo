import React from 'react';
import { X } from "lucide-react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  
 
  const { onlineUsers = [] } = useAuthStore(); 

  if (!selectedUser) return null;


  const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300 bg-base-100/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Avatar Section */}
          <div className="avatar">
            <div className="size-10 rounded-full relative overflow-hidden border border-base-300">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.name} 
                className="object-cover size-full"
              />
            </div>
          </div>

          {/* User Info Section */}
          <div>
            <h3 className="font-medium text-sm md:text-base leading-none">
              {selectedUser.name}
            </h3>
            <p className="text-[10px] md:text-xs text-base-content/50 mt-1 flex items-center gap-1.5">
              {/* Dynamic Status Dot */}
              <span className={`size-2 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-base-300"}`} />
              <span className="font-medium">
                {isOnline ? "Online" : "Offline"}
              </span>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error transition-all"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;