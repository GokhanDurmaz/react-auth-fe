import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'settings'>('overview');

  // Profile State
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: '',
    fullName: '',
    avatarUrl: '',
    bio: '',
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Password State
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await axiosClient.get('/v1/users/me');
      setProfileData({
        username: response.data.username || user?.username || '',
        email: response.data.email || '',
        fullName: response.data.fullName || '',
        avatarUrl: response.data.avatarUrl || '',
        bio: response.data.bio || '',
      });
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch profile information when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    setIsSavingProfile(true);

    try {
      const response = await axiosClient.put('/v1/users/me', {
        fullName: profileData.fullName,
        email: profileData.email,
        avatarUrl: profileData.avatarUrl,
        bio: profileData.bio,
      });

      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      
      if (response.data) {
        setProfileData((prev) => ({
          ...prev,
          ...response.data,
        }));
      }
    } catch (err: any) {
      setProfileStatus({
        type: 'error',
        message: err.response?.data?.message || 'An error occurred while updating the profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!passwords.oldPassword || !passwords.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosClient.post('auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      setPasswordStatus({ type: 'success', message: response.data.message || 'Password changed successfully!' });
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      setPasswordStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to change password.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
              App
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Console</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6" />
              </svg>
              Overview
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-xl text-sm transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900 capitalize">{activeTab}</h1>
          
          <div className="flex items-center gap-4">
            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden gap-1 bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setActiveTab('overview')} className={`px-2.5 py-1 text-xs font-semibold rounded ${activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>Overview</button>
              <button onClick={() => setActiveTab('profile')} className={`px-2.5 py-1 text-xs font-semibold rounded ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>Profile</button>
              <button onClick={() => setActiveTab('settings')} className={`px-2.5 py-1 text-xs font-semibold rounded ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>Settings</button>
            </div>

            {/* Header Profile Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="h-9 w-9 bg-indigo-100 text-indigo-700 font-semibold rounded-full flex items-center justify-center text-sm overflow-hidden border border-slate-200">
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt={user?.username || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  (profileData.fullName || user?.username || 'U')[0].toUpperCase()
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
                {profileData.fullName || user?.username || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-6 md:p-10 max-w-5xl space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Session Status</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">Active & Secure</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Role</p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-3">
                    {user?.role || 'Authenticated User'}
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Environment</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-semibold uppercase">
                      Kubernetes Pod
                    </span>
                  </div>
                </div>
              </section>

              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Workplace Overview</h2>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">
                  Your connection to the backend API is established. All operations in this area are protected with JWT authorization headers.
                </p>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-4a1 1 0 10-2 0v4z" clipRule="evenodd" />
                  </svg>
                  <span>Tip: You can switch between Profile and Settings from the left sidebar.</span>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Profile Details</h2>
                <p className="text-sm text-slate-500">Manage your personal information and public profile.</p>
              </div>

              {profileStatus && (
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  profileStatus.type === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}>
                  {profileStatus.message}
                </div>
              )}

              {isLoadingProfile ? (
                <div className="text-center py-10 text-slate-500">Loading profile details...</div>
              ) : (
                <>
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="h-20 w-20 bg-indigo-600 text-white font-bold text-2xl rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100 overflow-hidden">
                      {profileData.avatarUrl ? (
                        <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        (profileData.fullName || profileData.username || 'U')[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 max-w-md">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Avatar Image URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/avatar.png"
                        value={profileData.avatarUrl}
                        onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                      <input
                        type="text"
                        disabled
                        value={profileData.username}
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                      <textarea
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Account Security */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Security & Privacy</h2>
                  <p className="text-sm text-slate-500">Manage your authentication methods and notification preferences.</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Email Notifications</h4>
                      <p className="text-xs text-slate-500">Receive system alerts and updates via email.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <form onSubmit={updatePassword} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-900">Change Password</h3>

                {passwordStatus && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${
                    passwordStatus.type === 'success' 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                      : 'bg-rose-50 border border-rose-200 text-rose-700'
                  }`}>
                    {passwordStatus.message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;