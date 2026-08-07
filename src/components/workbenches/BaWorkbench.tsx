import React from 'react';

export const BaWorkbench: React.FC = () => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-lg font-semibold text-white mb-2">BA Workbench - Requirements Analysis</h3>
      <p className="text-slate-400 text-sm mb-4">Extract structured PRDs, user stories, and acceptance criteria using LLM agents.</p>
      <textarea
        className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm"
        placeholder="Paste feature request or user prompt here..."
      />
      <button className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium">
        Generate PRD
      </button>
    </div>
  );
};

export default BaWorkbench;
