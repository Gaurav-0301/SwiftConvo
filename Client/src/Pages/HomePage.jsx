import React from 'react';
import { useChatStore } from '../Store/useChatStore';
import Sidebar from '../Components/Sidebar';
import NochatSelected from '../Components/NochatSelected';
import ChatContainer from '../Components/ChatContainer';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 transition-all duration-300">
      <div className="flex items-center justify-center pt-20 px-4">
      
        <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-6xl h-[calc(100vh-8rem)] border border-base-300">
          <div className="flex h-full rounded-xl overflow-hidden">
            
         
            <Sidebar />

            
            <div className="flex-1 flex flex-col h-full min-w-0">
              {!selectedUser ? (
                <NochatSelected />
              ) : (
                <ChatContainer />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;