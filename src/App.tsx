import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardView from './views/DashboardView';
import WorkspaceView from './views/WorkspaceView';
import AgentConfigView from './views/AgentConfigView';
import TaskPipelineView from './views/TaskPipelineView';
import KnowledgeGraphView from './views/KnowledgeGraphView';
import HumanReviewView from './views/HumanReviewView';
import CreateTicketView from './views/CreateTicketView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'workspace': return <WorkspaceView />;
      case 'agent-config': return <AgentConfigView />;
      case 'task-pipeline': return <TaskPipelineView />;
      case 'knowledge-graph': return <KnowledgeGraphView />;
      case 'human-review': return <HumanReviewView />;
      case 'create-ticket': return <CreateTicketView />;
      case 'settings': return <SettingsView />;
      case 'profile': return <ProfileView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
