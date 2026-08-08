import React from 'react';

export const KnowledgeGraphView: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Knowledge Graph Visualizer</h2>
      <div className="h-96 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
        [ Interactive Project Entity & Relationship Graph Canvas ]
      </div>
    </div>
  );
};

export default KnowledgeGraphView;
