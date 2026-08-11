import { UserCircle2, Mail, Shield, Calendar, Edit3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-primary" /> Profile
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your account information and role access</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1 rounded-full border ${
            user.role === 'Admin' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
            user.role === 'PO Lead' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
            'bg-muted text-muted-foreground border-border'
          }`}>
            <Shield className="w-3 h-3" /> {user.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Email Address', value: user.email, icon: Mail },
          { label: 'Role', value: user.role, icon: Shield },
          { label: 'Member Since', value: 'August 2025', icon: Calendar },
          { label: 'Account ID', value: user.id, icon: UserCircle2, mono: true },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</span>
              </div>
              <p className={`text-sm font-bold text-foreground truncate ${item.mono ? 'font-mono text-xs text-muted-foreground' : ''}`}>
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Role Permissions */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Role Permissions
        </h3>
        {[
          { label: 'View Artifacts & Task Pipeline', allowed: true },
          { label: 'Create Tickets & Dispatch Tasks', allowed: true },
          { label: 'Approve / Reject in Human Review', allowed: user.role === 'Admin' || user.role === 'PO Lead' },
          { label: 'Register Agents & Skills', allowed: user.role === 'Admin' || user.role === 'PO Lead' },
          { label: 'System Configuration', allowed: user.role === 'Admin' },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
            <span className="text-xs text-foreground">{p.label}</span>
            <span className={`text-xs font-bold ${p.allowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500/60'}`}>
              {p.allowed ? '✓ Allowed' : '✗ Restricted'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
