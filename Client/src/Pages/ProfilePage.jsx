import React, { useState } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import { Camera, Check, Copy, Key, Loader2, Mail, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopyUid = () => {
    if (!authUser?.uid) return;
    navigator.clipboard.writeText(authUser.uid);
    setCopied(true);
    toast.success("UID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, etc.)');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      } catch (err) {
        setSelectedImg(null);
        toast.error('Failed to upload image');
      }
    };
  };

  const formattedDate = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className='min-h-screen pt-20 pb-12 overflow-y-auto bg-base-100'>
      <div className='max-w-2xl mx-auto p-4 space-y-6'>
        <div className='bg-base-200 border border-base-300 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm'>
          
          {/* Header */}
          <div className='text-center space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
            <p className='text-sm text-zinc-400'>Manage your account settings and profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selectedImg || authUser?.profilePic || '/avatar.png'}
                alt="Profile"
                className='w-32 h-32 rounded-full object-cover border-4 border-base-300 shadow-md'
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-1 right-1 bg-primary text-primary-content hover:scale-105 p-2.5 rounded-full cursor-pointer shadow-md transition-all duration-200 ${
                  isUpdatingProfile ? 'animate-pulse pointer-events-none opacity-80' : ''
                }`}
                title="Change profile photo"
              >
                {isUpdatingProfile ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Camera className='w-4 h-4' />
                )}
                <input
                  type="file"
                  id="avatar-upload"
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className='text-xs text-zinc-400'>
              {isUpdatingProfile
                ? 'Uploading profile photo...'
                : 'Click the camera icon to update your profile photo'}
            </p>
          </div>

          {/* User Details Section */}
          <div className='space-y-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2'>
                <User className='w-4 h-4 text-primary' />
                Full Name
              </label>
              <div className='px-4 py-3 bg-base-300/60 rounded-xl border border-base-content/10 text-sm font-medium'>
                {authUser?.name || 'No name provided'}
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2'>
                <Mail className='w-4 h-4 text-primary' />
                Email Address
              </label>
              <div className='px-4 py-3 bg-base-300/60 rounded-xl border border-base-content/10 text-sm font-medium'>
                {authUser?.email || 'No email provided'}
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2'>
                <Key className='w-4 h-4 text-primary' />
                Unique User ID (UID)
              </label>
              <div className='flex items-center justify-between px-4 py-2.5 bg-base-300/60 rounded-xl border border-base-content/10'>
                <span className='font-mono font-semibold text-primary tracking-wider text-sm'>
                  {authUser?.uid || 'N/A'}
                </span>
                {authUser?.uid && (
                  <button
                    onClick={handleCopyUid}
                    className='btn btn-xs btn-ghost gap-1 font-medium'
                    title="Copy UID"
                  >
                    {copied ? (
                      <>
                        <Check className='w-3.5 h-3.5 text-success' />
                        <span className='text-success'>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className='w-3.5 h-3.5' />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className='bg-base-300/40 border border-base-300 rounded-xl p-5 space-y-3'>
            <h2 className='text-sm font-semibold flex items-center gap-2'>
              <ShieldCheck className='w-4 h-4 text-primary' />
              Account Details
            </h2>
            <div className='divide-y divide-base-300 text-sm'>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-zinc-400'>Member Since</span>
                <span className='font-medium'>{formattedDate}</span>
              </div>
              <div className='flex items-center justify-between py-2.5'>
                <span className='text-zinc-400'>Account Status</span>
                <span className='badge badge-success badge-sm font-medium gap-1 text-success-content'>
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
