import { Search, Bell, Sun, Moon, LogOut, ChevronDown, UserCircle, Shield, User, Check } from 'lucide-react';
import { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  activeView: string;
  setActiveView: (v: string) => void;
}

const viewTitles: Record<string, string> = {
  dashboard: 'Command Center',
  workspace: 'Artifact',
  'agent-config': 'Agent Management',
  'task-pipeline': 'Task Pipeline',
  'knowledge-graph': 'Wiki',
  'human-review': 'Human Review Queue',
  'create-ticket': 'Create Ticket',
  settings: 'Settings',
  profile: 'User Profile',
};

const notificationsList = [
  {
    id: 'n1',
    title: 'Review Required',
    body: 'Feature Design Pkg (ART-901) is pending approval.',
    time: '10m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Pipeline Completed',
    body: 'Task TSK-890 finished Code Generation step.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Validation Warning',
    body: 'OCR Service connection retry limit reached.',
    time: '2h ago',
    unread: false,
  },
];

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const { user, login, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeRole, setActiveRole] = useState<'Admin' | 'User'>('Admin');

  const handleRoleToggle = (role: 'Admin' | 'User') => {
    setActiveRole(role);
    const userRole: UserRole = role === 'Admin' ? 'Admin' : 'User';
    login(user?.email || 'admin@aifactory.ai', 'password', userRole);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-40">
      {/* Title / Breadcrumb */}
      <div>
        <h1 className="text-lg font-bold text-foreground">
          {viewTitles[activeView] || 'Artifact'}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Admin / User Role Switcher Pill (Matching Screenshots 1 & 2) */}
        <div className="flex items-center gap-0.5 bg-muted/80 border border-border/80 rounded-full p-0.5 text-xs font-bold">
          <button
            onClick={() => handleRoleToggle('Admin')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeRole === 'Admin'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>
          <button
            onClick={() => handleRoleToggle('User')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeRole === 'User'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-3.5 h-3.5" /> User
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block w-56">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, artifacts..."
            className="w-full pl-10 pr-4 py-1.5 bg-muted/60 border border-border/60 rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all font-medium"
          />
        </div>

        {/* Notifications Dropdown (Screenshot 3) */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserDropdown(false); }}
            className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                <button className="text-[11px] font-bold text-sky-500 hover:underline cursor-pointer">
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                {notificationsList.map((item) => (
                  <div key={item.id} className="p-3.5 hover:bg-muted/40 transition-colors flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-foreground">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1">{item.time}</p>
                    </div>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-border bg-muted/30 text-center">
                <button
                  onClick={() => { setActiveView('human-review'); setShowNotifications(false); }}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer flex items-center justify-center"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Language Switcher */}
        <div className="flex items-center gap-0.5 bg-muted/60 border border-border/60 rounded-full p-0.5 text-[11px] font-bold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              language === 'en' ? 'bg-sky-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('vi')}
            className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
              language === 'vi' ? 'bg-sky-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            VI
          </button>
        </div>

        {/* User Profile Avatar */}
        {user && (
          <div className="relative">
            <button
              onClick={() => { setShowUserDropdown(!showUserDropdown); setShowNotifications(false); }}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-muted/60 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-xs font-bold text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setActiveView('profile'); setShowUserDropdown(false); }}
                  className="w-full px-4 py-2 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UserCircle className="w-3.5 h-3.5" /> Profile
                </button>
                <button
                  onClick={() => { logout(); setShowUserDropdown(false); }}
                  className="w-full px-4 py-2 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;
