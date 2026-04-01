import React from 'react';
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (

    
    <div className="flex flex-1 flex-col items-center justify-center w-full min-h-full p-8 md:p-16 bg-base-100/50 ">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Display with Glassmorphism container */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            {/* The Main "Floating" Container */}
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-bounce transition-transform duration-500 group-hover:scale-110 shadow-2xl border border-primary/20">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            
      
            <div className="absolute inset-0 rounded-3xl bg-primary/20 animate-ping -z-10" />
            <div className="absolute -inset-4 rounded-full bg-primary/5 animate-pulse -z-20 blur-xl" />
          </div>
        </div>

        {/* Text Content with enhanced typography */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-base-content">
            Welcome to <span className="text-primary italic drop-shadow-sm">SwiftConvo !</span>
          </h2>
          <p className="text-base-content/60 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            Select a conversation from sidebar to continue the <span className=" italic text-pink-300 drop-shadow-sm">SweetConvo</span> with your friends !!
          </p>
        </div>

        {/* Visual Divider */}
        <div className="divider opacity-10 px-12" />

       
        
      </div>
    </div>
  );
};

export default NoChatSelected;
