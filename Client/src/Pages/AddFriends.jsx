import React, { useState } from 'react';
import { Search, UserPlus, ShieldCheck, Check, X, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddFriends = () => {
  const [searchUid, setSearchUid] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock incoming requests list (Leave blank or connect to your Zustand store later)
  const [incomingRequests, setIncomingRequests] = useState([
    { _id: 'req_123', name: 'Sarah Jenkins', profilePic: '', uid: 'SARAH_9988' },
    { _id: 'req_456', name: 'Alex Rivera', profilePic: '', uid: 'ALEX_5541' },
  ]);

  // Handle UID Search Form Submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUid.trim()) return;

    setIsSearching(true);
    setSearchedUser(null);

    // TODO: Replace this simulated timeout with your Zustand store action (e.g., searchUserByUid)
    setTimeout(() => {
      if (searchUid.trim() === '123456') {
        setSearchedUser({
          _id: '6a5cc0bebcc6e61ef4dbfcbf',
          name: 'John Doe',
          profilePic: '',
          uid: '123456',
        });
        toast.success("User found!");
      } else {
        toast.error("No user found with this UID.");
      }
      setIsSearching(false);
    }, 500);
  };

  // TODO: Connect with your Zustand store action to send a request
  const handleSendRequest = (targetUid) => {
    toast.success(`Friend request sent to UID: ${targetUid}`);
    setSearchedUser(null);
    setSearchUid('');
  };

  const handleAccept = (requestId) => {
    setIncomingRequests(incomingRequests.filter(req => req._id !== requestId));
    toast.success("Friend request accepted!");
  };

  const handleReject = (requestId) => {
    setIncomingRequests(incomingRequests.filter(req => req._id !== requestId));
    toast.info("Friend request declined.");
  };

  return (
    <div className='h-screen pt-20 overflow-y-auto'>
      <div className='max-w-2xl mx-auto p-4 py-8 space-y-8'>
        
        {/* Page Header */}
        <div className='text-center'>
          <h1 className='text-2xl font-semibold'>Add Friends</h1>
          <p className='mt-2 text-sm text-zinc-400'>Connect with other users by searching their unique User ID (UID)</p>
        </div>

        {/* UID Search Bar Section */}
        <div className='bg-base-300 rounded-xl p-6 space-y-6'>
          <form onSubmit={handleSearch} className='flex gap-3'>
            <div className='relative flex-1'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400'>
                <Search className='w-4 h-4' />
              </span>
              <input
                type='text'
                value={searchUid}
                onChange={(e) => setSearchUid(e.target.value)}
                placeholder='Enter UID (e.g., 123456)...'
                className='w-full px-4 py-2.5 pl-10 bg-base-200 rounded-lg border text-sm focus:outline-none focus:ring-1'
              />
            </div>
            <button
              type='submit'
              disabled={isSearching}
              className='btn btn-primary px-6'
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Result Card */}
          {searchedUser && (
            <div className='pt-4 border-t border-zinc-700 flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <img
                  src={searchedUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className='w-12 h-12 rounded-full object-cover border'
                />
                <div>
                  <h3 className='text-base font-medium'>{searchedUser.name}</h3>
                  <p className='text-xs text-zinc-400 font-mono'>UID: {searchedUser.uid}</p>
                </div>
              </div>

              <button
                onClick={() => handleSendRequest(searchedUser.uid)}
                className='btn btn-sm btn-outline gap-1.5'
              >
                <UserPlus className='w-4 h-4' /> Add Friend
              </button>
            </div>
          )}
        </div>

        {/* Friend Requests Approval Section */}
        <div className='bg-base-300 rounded-xl p-6'>
          <h2 className='text-lg font-medium mb-4 flex items-center gap-2'>
            <ShieldCheck className='w-5 h-5 text-primary' /> 
            Friend Requests ({incomingRequests.length})
          </h2>

          {incomingRequests.length === 0 ? (
            <p className='text-zinc-400 text-sm py-4 text-center'>No pending friend requests.</p>
          ) : (
            <div className='space-y-3'>
              {incomingRequests.map((req) => (
                <div 
                  key={req._id} 
                  className='flex items-center justify-between bg-base-200 border p-4 rounded-xl'
                >
                  <div className='flex items-center space-x-3'>
                    <img 
                      src={req.profilePic || "/avatar.png"} 
                      alt="" 
                      className='w-10 h-10 rounded-full object-cover border' 
                    />
                    <div>
                      <h4 className='text-sm font-medium'>{req.name}</h4>
                      <span className='text-xs font-mono text-zinc-400'>UID: {req.uid}</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleAccept(req._id)}
                      className='btn btn-sm btn-success btn-square'
                      title="Accept Request"
                    >
                      <Check className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className='btn btn-sm btn-error btn-square'
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