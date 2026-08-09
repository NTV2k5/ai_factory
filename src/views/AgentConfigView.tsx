import React from 'react';

export const AgentConfigView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Agent Configuration Matrix</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white text-base mb-2">BA Agent</h3>
          <p className="text-xs text-slate-400">Generates PRDs, features, and specifications.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-white text-base mb-2">Designer Agent</h3>
          <p className="text-xs text-slate-400">Generates React components and Tailwind styles.</p>
        </div>
      </div>
    </div>
  );
};

export default AgentConfigView;
