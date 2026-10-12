import { LogOut, MessageSquare, Plus, Settings, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../Store/useAuthStore';
import { useSearchStore } from '../Store/useSearchStore';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { incomingRequests, getFriendRequests } = useSearchStore();

  useEffect(() => {
    if (authUser?._id) {
      getFriendRequests();
    }
  }, [authUser?._id, getFriendRequests]);

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className='text-lg font-bold'>SwiftConvo</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
            {/* Add Friends only appears when logged in */}
            {authUser && (
              <Link
                to="/addfriends"
                className='btn btn-sm gap-2 transition-colors relative'
              >
                <Plus className="w-4 h-4" />
                <span className='hidden sm:inline'>Add Friends</span>
                {incomingRequests.length > 0 && (
                  <span className='badge badge-primary badge-xs font-mono px-1.5'>
                    {incomingRequests.length}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/settings"
              className='btn btn-sm gap-2 transition-colors'
            >
              <Settings className="w-4 h-4" />
              <span className='hidden sm:inline'>Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className='btn btn-sm gap-2 transition-colors'
                >
                  <User className="w-4 h-4" />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>

                <button
                  className='btn btn-sm transition-colors flex gap-2 items-center'
                  onClick={logout}
                >
                  <LogOut className='size-4' />
                  <span className='hidden sm:inline'>LogOut</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
