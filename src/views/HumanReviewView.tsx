import React from 'react';

export const HumanReviewView: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Human Approval Queue</h2>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4">
          <h4 className="font-semibold text-white text-sm">Proposal: Git Commit Tree Push</h4>
          <p className="text-xs text-slate-400 my-2">Target remote: origin/main (https://github.com/NTV2k5/ai_factory.git)</p>
          <div className="flex space-x-3 mt-4">
            <button className="px-4 py-1.5 bg-emerald-600 text-white rounded text-xs font-medium">Approve & Push</button>
            <button className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded text-xs font-medium">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanReviewView;
