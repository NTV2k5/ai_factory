import React from 'react';

export const DashboardView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">System Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs font-medium">Total Commits</div>
          <div className="text-2xl font-bold text-white mt-1">29 Commits</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs font-medium">Active Branches</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">12 Branches</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs font-medium">Time Window</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">04/08 - 10/08</div>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs font-medium">Target Remote</div>
          <div className="text-sm font-semibold text-cyan-400 mt-2 truncate">origin/main</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
