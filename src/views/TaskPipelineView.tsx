import React from 'react';

export const TaskPipelineView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Task Pipeline Execution</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="font-medium text-amber-400 mb-3 text-sm">Queued (2)</h4>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-2">
            Refactor Dashboard Routing
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="font-medium text-blue-400 mb-3 text-sm">Running (1)</h4>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-2">
            Synthesize Git Branch Commits
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="font-medium text-emerald-400 mb-3 text-sm">Completed (12)</h4>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 mb-2">
            Initialize Project Repository
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPipelineView;
