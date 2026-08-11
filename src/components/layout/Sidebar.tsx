import {
  LayoutDashboard, FolderKanban, Settings2, Zap,
  CheckCircle2, PlusCircle, Settings, ChevronLeft, ChevronRight,
  BookOpen, Bot
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard',      label: 'Command Center',   icon: LayoutDashboard },
  { id: 'task-pipeline',  label: 'Task Pipeline',    icon: Zap },
  { id: 'agent-config',   label: 'Agent Management', icon: Bot },
  { id: 'workspace',      label: 'Artifact',         icon: FolderKanban },
  { id: 'knowledge-graph',label: 'Wiki',             icon: BookOpen },
  { id: 'human-review',   label: 'Human Review',     icon: CheckCircle2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-card border-r border-border flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
      collapsed ? 'w-16' : 'w-60'
    }`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-sm z-10 cursor-pointer transition-colors"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="p-3 space-y-5 flex flex-col items-center">
        {/* Logo */}
        <div className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-0.5'}`}>
          <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="font-bold text-base text-foreground tracking-tight whitespace-nowrap">
              Unified AI Factory
            </span>
          )}
        </div>

        {/* Create Ticket Action Button */}
        <button
          onClick={() => setActiveView('create-ticket')}
          className={`rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center hover:bg-sky-200/70 dark:hover:bg-sky-900/60 transition-all cursor-pointer shadow-sm ${
            collapsed 
              ? 'w-9 h-9 justify-center' 
              : 'w-full py-1.5 px-1.5 gap-2'
          }`}
          title="Create Ticket"
        >
          <div className="w-7 h-7 rounded-full bg-sky-200/60 dark:bg-sky-900/50 flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          {!collapsed && <span className="pr-2">Create Ticket</span>}
        </button>

        {/* Navigation Menu */}
        <nav className="w-full space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  collapsed
                    ? `w-9 h-9 mx-auto justify-center ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    : `w-full py-1 px-1 gap-2.5 text-left ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  collapsed 
                    ? '' 
                    : isActive ? 'bg-sky-500/20' : 'bg-transparent'
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                </div>
                {!collapsed && <span className="truncate pr-2">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Link */}
      <div className="p-3 border-t border-border flex justify-center">
        <button
          onClick={() => setActiveView('settings')}
          className={`flex items-center rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-all cursor-pointer ${
            collapsed
              ? `w-9 h-9 justify-center ${activeView === 'settings' ? 'bg-sky-600 text-white shadow-md' : ''}`
              : `w-full py-1 px-1 gap-2.5 text-left ${activeView === 'settings' ? 'bg-sky-600/10 text-sky-600 dark:text-sky-400 font-bold' : ''}`
          }`}
          title={collapsed ? "Settings" : undefined}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
