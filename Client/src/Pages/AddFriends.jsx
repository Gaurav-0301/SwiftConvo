import React, { useState, useEffect } from 'react';
import { Search, UserPlus, ShieldCheck, Check, X, Copy, Clock, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSearchStore } from '../Store/useSearchStore';
import { useAuthStore } from '../Store/useAuthStore';

const AddFriends = () => {
  const [searchUid, setSearchUid] = useState('');
  const [copied, setCopied] = useState(false);

  const { authUser } = useAuthStore();
  const {
    searching,
    isSendingRequest,
    isLoadingRequests,
    searchedUser,
    relationshipStatus,
    isSelf,
    incomingRequests,
    searchUser,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    subscribeToFriendEvents,
    unSubscribeFromFriendEvents,
    clearSearchedUser,
  } = useSearchStore();

  useEffect(() => {
    getFriendRequests();
    subscribeToFriendEvents();
    return () => {
      unSubscribeFromFriendEvents();
    };
  }, [getFriendRequests, subscribeToFriendEvents, unSubscribeFromFriendEvents]);

  const handleCopyUid = () => {
    if (!authUser?.uid) return;
    navigator.clipboard.writeText(authUser.uid);
    setCopied(true);
    toast.success("UID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUid.trim()) {
      toast.error("Please enter a UID");
      return;
    }
    await searchUser({ uid: searchUid.trim() });
  };

  const handleSendRequest = async (targetId) => {
    const success = await sendFriendRequest(targetId);
    if (success) {
      setSearchUid('');
    }
  };

  return (
    <div className='min-h-screen pt-20 pb-12 overflow-y-auto bg-base-100'>
      <div className='max-w-2xl mx-auto p-4 space-y-8'>
        
        {/* Page Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Add Friends</h1>
          <p className='text-sm text-zinc-400'>
            Connect with friends across SwiftConvo using unique User IDs (UID)
          </p>
        </div>

        {/* User's Own UID Card */}
        {authUser?.uid && (
          <div className='bg-base-200 border border-base-300 rounded-2xl p-4 flex items-center justify-between shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 bg-primary/10 text-primary rounded-xl'>
                <Sparkles className='w-5 h-5' />
              </div>
              <div>
                <p className='text-xs text-zinc-400 font-medium'>Your Unique ID (Share with friends)</p>
                <p className='font-mono font-semibold text-base text-primary tracking-wider'>{authUser.uid}</p>
              </div>
            </div>
            <button
              onClick={handleCopyUid}
              className='btn btn-sm btn-ghost gap-1.5 font-medium'
              title="Copy UID"
            >
              {copied ? <Check className='w-4 h-4 text-success' /> : <Copy className='w-4 h-4' />}
              <span className='hidden sm:inline'>{copied ? "Copied" : "Copy UID"}</span>
            </button>
          </div>
        )}

        {/* UID Search Bar Section */}
        <div className='bg-base-200 border border-base-300 rounded-2xl p-6 space-y-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <h2 className='text-base font-semibold'>Search by UID</h2>
            {searchedUser && (
              <button
                onClick={clearSearchedUser}
                className='text-xs text-zinc-400 hover:text-zinc-200 transition-colors'
              >
                Clear result
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className='flex gap-3'>
            <div className='relative flex-1'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400'>
                <Search className='w-4 h-4' />
              </span>
              <input
                type='text'
                value={searchUid}
                onChange={(e) => setSearchUid(e.target.value)}
                placeholder='Enter UID (e.g. 660f9e1a2b)...'
                className='w-full px-4 py-2.5 pl-10 bg-base-300 rounded-xl border border-base-content/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'
              />
            </div>
            <button
              type='submit'
              disabled={searching}
              className='btn btn-primary px-6 rounded-xl'
            >
              {searching ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Searching</span>
                </>
              ) : (
                "Search"
              )}
            </button>
          </form>

          {/* Search Result Card */}
          {searchedUser && (
            <div className='pt-4 border-t border-base-300 flex items-center justify-between animate-fadeIn'>
              <div className='flex items-center space-x-4 min-w-0'>
                <img
                  src={searchedUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className='w-12 h-12 rounded-full object-cover border border-base-content/10 shadow-sm'
                />
                <div className='min-w-0'>
                  <h3 className='text-base font-semibold truncate'>{searchedUser.name}</h3>
                  <p className='text-xs text-zinc-400 font-mono'>UID: {searchedUser.uid}</p>
                </div>
              </div>

              <div>
                {isSelf ? (
                  <span className='badge badge-neutral py-3 px-3 text-xs font-medium'>
                    You
                  </span>
                ) : relationshipStatus === 'friends' ? (
                  <span className='badge badge-success py-3 px-3 text-xs font-medium gap-1 text-success-content'>
                    <Check className='w-3.5 h-3.5' /> Friends
                  </span>
                ) : relationshipStatus === 'request_sent' ? (
                  <span className='badge badge-warning py-3 px-3 text-xs font-medium gap-1 text-warning-content'>
                    <Clock className='w-3.5 h-3.5' /> Pending
                  </span>
                ) : relationshipStatus === 'request_received' ? (
                  <button
                    onClick={() => {
                      const req = incomingRequests.find(r => r.uid === searchedUser.uid);
                      if (req) acceptFriendRequest(req._id);
                    }}
                    className='btn btn-sm btn-success gap-1.5'
                  >
                    <UserCheck className='w-4 h-4' /> Accept
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(searchedUser._id)}
                    disabled={isSendingRequest}
                    className='btn btn-sm btn-primary gap-1.5'
                  >
                    {isSendingRequest ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <UserPlus className='w-4 h-4' />
                    )}
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Friend Requests Approval Section */}
        <div className='bg-base-200 border border-base-300 rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold flex items-center gap-2'>
              <ShieldCheck className='w-5 h-5 text-primary' /> 
              Friend Requests
            </h2>
            <span className='badge badge-primary font-mono text-xs'>
              {incomingRequests.length}
            </span>
          </div>

          {isLoadingRequests ? (
            <div className='flex items-center justify-center py-8 text-zinc-400 gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span className='text-sm'>Loading requests...</span>
            </div>
          ) : incomingRequests.length === 0 ? (
            <div className='text-center py-8 space-y-1'>
              <p className='text-zinc-400 text-sm'>No pending friend requests.</p>
              <p className='text-xs text-zinc-500'>Incoming requests from other users will show up here.</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {incomingRequests.map((req) => (
                <div 
                  key={req._id} 
                  className='flex items-center justify-between bg-base-300/60 border border-base-300 p-3.5 rounded-xl transition-all'
                >
                  <div className='flex items-center space-x-3 min-w-0'>
                    <img 
                      src={req.profilePic || "/avatar.png"} 
                      alt={req.name} 
                      className='w-11 h-11 rounded-full object-cover border border-base-content/10' 
                    />
                    <div className='min-w-0'>
                      <h4 className='text-sm font-semibold truncate'>{req.name}</h4>
                      <span className='text-xs font-mono text-zinc-400'>UID: {req.uid}</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => acceptFriendRequest(req._id)}
                      className='btn btn-sm btn-success btn-circle'
                      title="Accept Request"
                    >
                      <Check className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(req._id)}
                      className='btn btn-sm btn-error btn-circle'
                      title="Decline Request"
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AddFriends;