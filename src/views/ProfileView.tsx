import React from 'react';

export const ProfileView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            SE
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Senior Software Engineer</h3>
            <p className="text-sm text-slate-400">admin@aifactory.ai • Lead Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
