import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Navigation Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Welcome back, <span className="font-semibold text-indigo-400">{user?.username || 'User'}</span>!
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
            <p className="text-sm text-slate-400 font-medium">Session Status</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="text-xl font-semibold text-white">Active & Secure</h3>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
            <p className="text-sm text-slate-400 font-medium">Role</p>
            <h3 className="text-xl font-semibold text-white mt-3">
              {user?.role || 'Authenticated User'}
            </h3>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
            <p className="text-sm text-slate-400 font-medium">Environment</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider">
                Kubernetes Pod
              </span>
            </div>
          </div>
        </section>

        {/* Main Content Card */}
        <main className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-4">Workplace Overview</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            Your connection to the backend API is established. All operations in this area are protected with JWT authorization headers.
          </p>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-sm flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-4a1 1 0 10-2 0v4z" clipRule="evenodd" />
            </svg>
            <span>Tip: You can expand this layout with microservices metrics or user profiles.</span>
          </div>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;