import React from 'react';

export const UserPortalView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">User Portal Overview</h2>
      <p className="text-slate-400 text-sm">Access your assigned tasks, review specs, and track agent builds.</p>
    </div>
  );
};

export default UserPortalView;
