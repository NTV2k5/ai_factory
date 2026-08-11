import { Settings, Moon, Sun, Globe, Bell, Shield, Database, Sliders } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const SettingsView: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({ agentComplete: true, reviewReady: true, systemAlert: false });
  const [gatewayUrl, setGatewayUrl] = useState(import.meta.env.VITE_AGYN_GATEWAY_URL || '/agyn-gateway');

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(n => ({ ...n, [key]: !n[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your AI Factory Agent Platform preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="w-4 h-4 text-primary" /> Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
          </div>
          <button
            onClick={() => { setDarkMode(!darkMode); document.documentElement.classList.toggle('dark'); }}
            className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${darkMode ? 'bg-primary' : 'bg-muted border border-border'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Language</p>
            <p className="text-xs text-muted-foreground">Interface display language</p>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              EN
            </button>
            <button onClick={() => setLanguage('vi')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'vi' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              VI
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Bell className="w-4 h-4 text-primary" /> Notifications
        </h3>
        {[
          { key: 'agentComplete' as const, label: 'Agent Task Complete', desc: 'When an AI agent finishes its task' },
          { key: 'reviewReady' as const, label: 'Review Ready', desc: 'When an artifact requires your review' },
          { key: 'systemAlert' as const, label: 'System Alerts', desc: 'System-level errors and warnings' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${notifications[item.key] ? 'bg-primary' : 'bg-muted border border-border'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${notifications[item.key] ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Gateway Config */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Database className="w-4 h-4 text-primary" /> Agyn Gateway Configuration
        </h3>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Gateway Base URL</label>
          <input
            value={gatewayUrl}
            onChange={e => setGatewayUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-[10px] text-muted-foreground mt-1.5">Proxied via Vite dev server. Production: https://gateway.agyn.dev:2496</p>
        </div>
        <div className="bg-muted/40 border border-border rounded-xl p-3 text-xs font-mono text-muted-foreground">
          <p className="font-bold text-foreground mb-1">Active Endpoints:</p>
          <p>AgentsGateway: {gatewayUrl}/agynio.api.gateway.v1.AgentsGateway/</p>
          <p>ThreadsGateway: {gatewayUrl}/agynio.api.gateway.v1.ThreadsGateway/</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
