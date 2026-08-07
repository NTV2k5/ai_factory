import React from 'react';

export const Header: React.FC<{ activeView: string; setActiveView: (v: string) => void }> = ({ activeView }) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">AI</div>
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AI Factory Suite
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800">
          Current View: {activeView}
        </span>
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold">
          SE
        </div>
      </div>
    </header>
  );
};

export default Header;
