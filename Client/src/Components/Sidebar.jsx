import React, { useEffect, useState } from 'react';
import { useChatStore } from '../Store/useChatStore';
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from 'lucide-react';
import { useAuthStore } from './../Store/useAuthStore';

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading, 
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // SAFE GUARDS: Ensure these are ALWAYS arrays before touching them
  const safeUsers = Array.isArray(users) ? users : [];
  const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers.map(String) : [];

  // Filter logic: show online only or all friends
  const filteredUsers = showOnlineOnly 
    ? safeUsers.filter(user => safeOnlineUsers.includes(user._id?.toString())) 
    : safeUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-primary" />
          <span className="font-medium hidden lg:block">Friends ({safeUsers.length})</span>
        </div>
        
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({safeUsers.filter(u => safeOnlineUsers.includes(u._id?.toString())).length} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isUserOnline = safeOnlineUsers.includes(user._id?.toString());
          const isSelected = selectedUser?._id?.toString() === user._id?.toString();

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name || "User"}
                  className="size-12 object-cover rounded-full border border-base-300"
                />
                {isUserOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.name}</div>
                <div className="text-xs flex items-center gap-1.5 mt-0.5">
                  <span className={`size-1.5 rounded-full ${isUserOnline ? "bg-green-500" : "bg-zinc-500"}`} />
                  <span className={isUserOnline ? "text-green-500 font-medium" : "text-zinc-500"}>
                    {isUserOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-10 px-4">
            {showOnlineOnly ? (
              <p className="text-sm">No online friends</p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">No friends yet</p>
                <p className="text-xs text-zinc-400">Use "Add Friends" to connect with users via their UID!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;