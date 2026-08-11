import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import WorkspaceView from './views/WorkspaceView';
import AgentConfigView from './views/AgentConfigView';
import TaskPipelineView from './views/TaskPipelineView';
import KnowledgeGraphView from './views/KnowledgeGraphView';
import HumanReviewView from './views/HumanReviewView';
import CreateTicketView from './views/CreateTicketView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';

function AppShell() {
  const { isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('workspace'); // Default to Artifact view like original

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':       return <DashboardView onCreateTicket={() => setActiveView('create-ticket')} onNavigate={(view) => setActiveView(view)} />;
      case 'workspace':       return <WorkspaceView />;
      case 'agent-config':    return <AgentConfigView />;
      case 'task-pipeline':   return <TaskPipelineView />;
      case 'knowledge-graph': return <KnowledgeGraphView />;
      case 'human-review':    return <HumanReviewView />;
      case 'create-ticket':   return <CreateTicketView onBack={() => setActiveView('dashboard')} />;
      case 'settings':        return <SettingsView />;
      case 'profile':         return <ProfileView />;
      default:                return <WorkspaceView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto bg-slate-100/70 dark:bg-background p-6 transition-colors">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
