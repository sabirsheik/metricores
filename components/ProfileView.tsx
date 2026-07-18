'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Calendar, Clock, Shield, LogOut, 
  Edit, CheckCircle, ArrowLeft, Save, X, 
  Eye, EyeOff, Key, AlertCircle, Loader2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ProfileView() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePicture: '',
  });

  // Password form state
  const [showPassword, setShowPassword] = useState<'current' | 'new' | 'confirm' | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Initialize form when session loads
  useEffect(() => {
    if (session?.user) {
      setProfileForm({
        fullName: session.user.name || '',
        username: '',
        bio: '',
        profilePicture: session.user.image || '',
      });
    }
  }, [session]);

  // Format date
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Not available';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Not available';
    }
  };

  // Get provider badge color
  const getProviderBadge = (provider: string | undefined) => {
    switch (provider) {
      case 'google':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'email':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      default:
        return { bg: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200' };
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      const data = await response.json();
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.fullName,
          image: data.user.profilePicture,
        },
      });

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...passwordForm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const providerBadge = getProviderBadge(session?.user?.provider);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[95%] w-[95%] mx-auto px-4 md:px-6 pt-8 md:pt-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white border border-zinc-200 rounded-sm p-6 md:p-8 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-zinc-100 border-4 border-zinc-50 shadow-inner flex items-center justify-center overflow-hidden">
                  {session?.user?.image && !imageError ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Profile'}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-12 h-12 text-zinc-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-zinc-900 text-white p-1.5 rounded-sm hover:bg-zinc-800 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* User Info Header */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="text-2xl md:text-3xl font-bold text-zinc-900 border-none outline-none bg-transparent w-full"
                        placeholder="Your full name"
                      />
                    ) : (
                      <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">
                        {session?.user?.name || 'User'}
                      </h1>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-sm text-zinc-500 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {session?.user?.email}
                      </span>
                      {session?.user?.emailVerified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border ${providerBadge.bg} ${providerBadge.text} ${providerBadge.border}`}>
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {session?.user?.provider === 'google' ? 'Google' : 'Email'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'border-zinc-900 text-zinc-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'security' 
                  ? 'border-zinc-900 text-zinc-900' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Security
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <>
              {/* Account Details Section */}
              <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase">
                    Account Details
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setProfileForm({
                            fullName: session?.user?.name || '',
                            username: '',
                            bio: '',
                            profilePicture: session?.user?.image || '',
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:bg-zinc-50 rounded-sm transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-zinc-100">
                  {/* Full Name */}
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                        <User className="w-4.5 h-4.5 text-zinc-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                          Full Name
                        </p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                            className="w-full text-sm font-semibold text-zinc-900 border border-zinc-300 rounded-sm px-2 py-1.5 outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-zinc-900">
                            {session?.user?.name || 'Not set'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                        <Mail className="w-4.5 h-4.5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                          Email Address
                        </p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {session?.user?.email || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Created */}
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                        <Calendar className="w-4.5 h-4.5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                          Account Created
                        </p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatDate(session?.user?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                        <Clock className="w-4.5 h-4.5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                          Last Login
                        </p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatDate(session?.user?.lastLogin)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security Tab Content */}
          {activeTab === 'security' && (
            <div className="bg-white border border-zinc-200 rounded-sm shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900 tracking-wider uppercase">
                  Security Settings
                </h2>
              </div>

              <div className="divide-y divide-zinc-100">
                {/* Password Section */}
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-sm bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                      <Key className="w-4.5 h-4.5 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                        Password
                      </p>
                      {session?.user?.provider === 'google' ? (
                        <p className="text-sm text-zinc-600">
                          This account uses Google Sign-In. Password changes are managed through your Google Account.
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-600">
                          Manage your password
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Change Form (only for email users) */}
                  {session?.user?.provider === 'email' && (
                    <div className="pl-14 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword === 'current' ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full text-sm border border-zinc-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(showPassword === 'current' ? null : 'current')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword === 'current' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword === 'new' ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full text-sm border border-zinc-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(showPassword === 'new' ? null : 'new')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword === 'new' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPassword === 'confirm' ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full text-sm border border-zinc-300 rounded-sm px-3 py-2 outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(showPassword === 'confirm' ? null : 'confirm')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                          >
                            {showPassword === 'confirm' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isChangingPassword ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : null}
                        Update Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => signOut()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-sm transition-colors text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

