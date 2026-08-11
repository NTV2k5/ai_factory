import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@aifactory.ai');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  const quickRoles: { label: string; email: string; role: UserRole; desc: string }[] = [
    { label: 'Admin', email: 'admin@aifactory.ai', role: 'Admin', desc: 'Full access – approve, configure' },
    { label: 'PO Lead', email: 'po@aifactory.ai', role: 'PO Lead', desc: 'Approval gate access' },
    { label: 'Specialist', email: 'engineer@aifactory.ai', role: 'User', desc: 'View & create tasks' },
    { label: 'Designer', email: 'designer@aifactory.ai', role: 'User', desc: 'Penpot workbench access' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary mx-auto flex items-center justify-center font-bold text-xl text-primary-foreground mb-3">AI</div>
          <h1 className="text-xl font-bold text-foreground flex items-center justify-center gap-1.5">
            Unified AI Factory <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Log in to the BA, Designer & Validation Agents management system (UAPDF-AIS-001)
          </p>
        </div>

        {/* Quick Role Selector */}
        <div className="mb-6 bg-muted/40 p-3 rounded-2xl border border-border">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">
            Quick Select Role for Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {quickRoles.map(r => (
              <button
                key={r.role + r.label}
                type="button"
                onClick={() => { setEmail(r.email); setSelectedRole(r.role); }}
                className={`px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer border ${
                  email === r.email
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <span className="block font-bold text-foreground">{r.label}</span>
                <span className="text-[10px] font-normal">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="admin@aifactory.ai"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("The system will send a password reset link to your email."); }} className="text-[11px] font-semibold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary bg-background"
              />
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            Log in to the System <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
