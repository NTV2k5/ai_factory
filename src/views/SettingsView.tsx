import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex justify-between items-center py-3 border-b border-slate-800">
            <span>Primary LLM Model</span>
            <span className="font-semibold text-indigo-400">Gemini 3.6 Flash</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-800">
            <span>Git Synchronization</span>
            <span className="font-semibold text-emerald-400">Enabled (GitHub origin)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
