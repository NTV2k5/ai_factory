import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'workspace', label: 'Workspace', icon: '🎨' },
  { id: 'agent-config', label: 'Agent Config', icon: '⚙️' },
  { id: 'task-pipeline', label: 'Task Pipeline', icon: '⚡' },
  { id: 'knowledge-graph', label: 'Knowledge Graph', icon: '🧠' },
  { id: 'human-review', label: 'Human Review', icon: '✅' },
  { id: 'create-ticket', label: 'Create Ticket', icon: '➕' },
  { id: 'settings', label: 'Settings', icon: '🔧' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col justify-between">
      <div className="p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Navigation</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-900 text-xs text-slate-600 text-center">
        v1.0.0 • AI Factory Agent System
      </div>
    </aside>
  );
};

export default Sidebar;
