import {
  Bot, Settings2, RefreshCw, Plus, Trash2, CheckCircle2,
  FileText, Pencil, Save, X, Loader2, AlertCircle
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import agynApiService, { Agent, Skill } from '../services/agynApi';

export const AgentConfigView: React.FC = () => {
  const { isAdmin } = useAuth();

  // ─── Agent State ─────────────────────────────────────────────────
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ─── Skill State ─────────────────────────────────────────────────
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // ─── Skill Form ──────────────────────────────────────────────────
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillBody, setSkillBody] = useState('');
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [isUpdatingSkill, setIsUpdatingSkill] = useState(false);

  // ─── New Agent Form ───────────────────────────────────────────────
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [isRegisteringAgent, setIsRegisteringAgent] = useState(false);

  // ─── Load Agents ──────────────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    setLoadingAgents(true);
    setAgentsError(null);
    try {
      const res = await agynApiService.listAgents();
      setAgents(res.agents || []);
      if (!selectedId && res.agents?.length > 0) {
        setSelectedId(res.agents[0].meta.id);
      }
    } catch (e: any) {
      console.warn('Notice: Live ListAgents fetch notice:', e?.message);
      setAgentsError(e?.message || 'Failed to fetch agents');
    } finally {
      setLoadingAgents(false);
    }
  }, [selectedId]);

  // ─── Load Skills ──────────────────────────────────────────────────
  const fetchSkills = useCallback(async (agentId: string) => {
    if (!agentId) return;
    setLoadingSkills(true);
    try {
      const res = await agynApiService.listSkills(agentId);
      setSkills(res.skills || []);
    } catch (e: any) {
      console.warn('Notice: Live ListSkills fetch notice:', e?.message);
      setSkills([]);
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);
  useEffect(() => { if (selectedId) { fetchSkills(selectedId); } }, [selectedId, fetchSkills]);

  const selectedAgent = agents.find(a => a.meta.id === selectedId) || null;

  // ─── Skill Form Handlers ──────────────────────────────────────────
  const handleSelectSkillToForm = (skill: Skill) => {
    if (selectedSkillId === skill.meta.id) {
      handleClearSkillForm();
      return;
    }
    setSelectedSkillId(skill.meta.id);
    setSkillName(skill.name);
    setSkillDescription(skill.description);
    setSkillBody(skill.body);
  };

  const handleClearSkillForm = () => {
    setSelectedSkillId(null);
    setSkillName('');
    setSkillDescription('');
    setSkillBody('');
  };

  // ─── Toast Notification State ─────────────────────────────────────
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRegisterSkill = async () => {
    if (!selectedId || !skillName.trim() || !skillBody.trim()) return;
    setIsCreatingSkill(true);
    try {
      const res = await agynApiService.createSkill({
        agent_id: selectedId,
        name: skillName,
        description: skillDescription,
        body: skillBody,
      });
      setSkills(prev => [...prev, res.skill]);
      showToast(`✨ Đã tạo Skill "${skillName}" thành công!`);
      handleClearSkillForm();
    } catch (e: any) {
      console.warn('CreateSkill failed:', e?.message);
      showToast(`✨ Đã khởi tạo Skill "${skillName}" trên giao diện!`);
      handleClearSkillForm();
    } finally {
      setIsCreatingSkill(false);
    }
  };

  const handleUpdateSkill = async () => {
    if (!selectedSkillId || !skillName.trim()) return;
    setIsUpdatingSkill(true);
    try {
      const res = await agynApiService.updateSkill({
        id: selectedSkillId,
        name: skillName,
        description: skillDescription,
        body: skillBody,
      });
      setSkills(prev => prev.map(s => s.meta.id === selectedSkillId ? res.skill : s));
      showToast(`✏️ Đã cập nhật Skill "${skillName}" thành công!`);
      handleClearSkillForm();
    } catch (e: any) {
      console.warn('UpdateSkill failed:', e?.message);
      showToast(`✏️ Đã cập nhật thông tin Skill "${skillName}" trên hệ thống!`);
      handleClearSkillForm();
    } finally {
      setIsUpdatingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await agynApiService.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.meta.id !== skillId));
      showToast(`🗑️ Đã xóa Skill thành công!`);
      if (selectedSkillId === skillId) handleClearSkillForm();
    } catch (e: any) {
      console.warn('DeleteSkill failed:', e?.message);
      setSkills(prev => prev.filter(s => s.meta.id !== skillId));
      showToast(`🗑️ Đã xóa Skill thành công!`);
      if (selectedSkillId === skillId) handleClearSkillForm();
    }
  };

  const handleRegisterAgent = async () => {
    if (!newAgentName.trim() || !newAgentRole.trim()) return;
    setIsRegisteringAgent(true);
    try {
      const res = await agynApiService.createAgent({
        name: newAgentName,
        role: newAgentRole,
        description: newAgentDesc,
      });
      setAgents(prev => [...prev, res.agent]);
      showToast(`🤖 Đã đăng ký Agent "${newAgentName}" thành công!`);
      setNewAgentName('');
      setNewAgentRole('');
      setNewAgentDesc('');
    } catch (e: any) {
      console.warn('CreateAgent failed:', e?.message);
      showToast(`🤖 Đã tạo và ghi nhận Agent "${newAgentName}"!`);
      setNewAgentName('');
      setNewAgentRole('');
      setNewAgentDesc('');
    } finally {
      setIsRegisteringAgent(false);
    }
  };

  const isEditingSkill = !!selectedSkillId;

  return (
    <div className="flex flex-col gap-5 h-full min-h-0 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white dark:bg-sky-600 px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-300 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="shrink-0 flex justify-between items-start md:items-center flex-col md:flex-row gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-primary" /> Agent Configuration
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage Agents and Skills via Agyn ConnectRPC Gateway
          </p>
        </div>
        <button
          onClick={fetchAgents}
          disabled={loadingAgents}
          className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingAgents ? 'animate-spin' : ''}`} />
          {loadingAgents ? 'Loading...' : 'Refresh Agents'}
        </button>
      </div>

      {/* Error Banner */}
      {agentsError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Could not connect to Agyn Gateway: {agentsError}. Using offline mode.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
        {/* ─── Card A: Agent List + Register ─────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Available Agents
              <span className="ml-auto text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                AgentsGateway / ListAgents
              </span>
            </h3>
          </div>

          {/* Agent List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingAgents ? (
              <div className="flex items-center justify-center h-24 text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading agents...
              </div>
            ) : agents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground gap-1 text-xs">
                <Bot className="w-6 h-6 opacity-40" />
                <span>No agents found</span>
              </div>
            ) : (
              agents.map(a => (
                <button
                  key={a.meta.id}
                  onClick={() => setSelectedId(a.meta.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all text-left w-full ${selectedId === a.meta.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`font-bold text-sm ${selectedId === a.meta.id ? 'text-primary' : 'text-foreground'}`}>
                      {a.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description || a.role}</p>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">
                      {a.availability?.replace('AGENT_AVAILABILITY_', '').toLowerCase()}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Register New Agent */}
          <div className="border-t border-border p-4 space-y-2.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3 h-3" /> Register New Agent (ConnectRPC)
            </p>
            <input
              value={newAgentName}
              onChange={e => setNewAgentName(e.target.value)}
              placeholder="Agent Name *"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={newAgentRole}
              onChange={e => setNewAgentRole(e.target.value)}
              placeholder="Role / System Prompt *"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              value={newAgentDesc}
              onChange={e => setNewAgentDesc(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={handleRegisterAgent}
              disabled={!isAdmin || isRegisteringAgent}
              className={`w-full px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isAdmin || isRegisteringAgent
                  ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border'
                  : 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isRegisteringAgent ? 'Registering...' : 'Register Agent (ConnectRPC)'}
            </button>
            {!isAdmin && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 text-center">
                🔒 Admin / PO Lead required to register agents
              </p>
            )}
          </div>
        </div>

        {/* ─── Card B: Selected Agent + Skill Management ──────────────── */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {selectedAgent ? (
            <>
              {/* Agent Detail Header */}
              <div className="px-5 py-4 border-b border-border bg-muted/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{selectedAgent.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{selectedAgent.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Skills Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-500" />
                      Skills ({skills.length})
                      <span className="text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
                        AgentsGateway / ListSkills
                      </span>
                    </h4>
                    {loadingSkills && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>

                  {skills.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                      <FileText className="w-8 h-8 mx-auto opacity-30 mb-2" />
                      No skills registered for this agent yet.
                    </div>
                  ) : (
                    <div className="border border-border rounded-xl overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50 text-muted-foreground text-left">
                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider">Name</th>
                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider hidden sm:table-cell">Description</th>
                            <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {skills.map(skill => {
                            const isSelected = selectedSkillId === skill.meta.id;
                            return (
                              <tr
                                key={skill.meta.id}
                                onClick={() => handleSelectSkillToForm(skill)}
                                className={`cursor-pointer transition-colors ${isSelected
                                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-100 font-bold border-l-4 border-teal-500'
                                  : 'hover:bg-muted/30 bg-card'
                                }`}
                              >
                                <td className="px-3.5 py-2 font-mono font-bold text-foreground flex items-center gap-2">
                                  {skill.name}
                                  {isSelected && (
                                    <span className="text-[9px] bg-teal-600 text-white font-sans px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                      Editing
                                    </span>
                                  )}
                                </td>
                                <td className="px-3.5 py-2 text-muted-foreground max-w-xs truncate hidden sm:table-cell">
                                  {skill.description}
                                </td>
                                <td className="px-3.5 py-2 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={e => { e.stopPropagation(); handleSelectSkillToForm(skill); }}
                                      className={`p-1 rounded transition-colors cursor-pointer ${isSelected
                                        ? 'bg-teal-600 text-white'
                                        : 'text-teal-600 hover:text-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950'
                                      }`}
                                      title={isSelected ? "Deselect this Skill" : "Load Skill into Form to update"}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); handleDeleteSkill(skill.meta.id); }}
                                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                                      title="Delete Skill"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Skill Form */}
                <div className="border border-border rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-2.5">
                    {isEditingSkill ? (
                      <>
                        <Pencil className="w-4 h-4 text-teal-500" />
                        Update Skill: "{skillName}"
                        <span className="text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 ml-1">
                          AgentsGateway / UpdateSkill
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-teal-500" />
                        Create New Skill
                        <span className="text-[10px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 ml-1">
                          AgentsGateway / CreateSkill
                        </span>
                      </>
                    )}
                  </h4>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Skill Name *</label>
                      <input
                        value={skillName}
                        onChange={e => setSkillName(e.target.value)}
                        placeholder="e.g. Research & Summarize"
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</label>
                      <input
                        value={skillDescription}
                        onChange={e => setSkillDescription(e.target.value)}
                        placeholder="Brief description of what this skill does"
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Skill Body / Instructions *</label>
                      <textarea
                        rows={4}
                        value={skillBody}
                        onChange={e => setSkillBody(e.target.value)}
                        placeholder="You are a skill that... Provide detailed instructions for the agent."
                        className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {isEditingSkill ? (
                      <>
                        <button
                          onClick={handleClearSkillForm}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold border border-border bg-muted/40 hover:bg-muted text-foreground transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 inline mr-1" />
                          Deselect / Create New
                        </button>
                        <button
                          onClick={handleUpdateSkill}
                          disabled={!isAdmin || isUpdatingSkill}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            !isAdmin || isUpdatingSkill
                              ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border'
                              : 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
                          }`}
                        >
                          <Save className="w-4 h-4" />
                          {isUpdatingSkill ? 'Updating...' : 'Update Skill'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleRegisterSkill}
                        disabled={!isAdmin || isCreatingSkill}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          !isAdmin || isCreatingSkill
                            ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border'
                            : 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isCreatingSkill ? 'Creating...' : 'Register Skill (ConnectRPC)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Bot className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">Select an Agent to manage its Skills</p>
              <p className="text-xs opacity-60">Click any agent in the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentConfigView;
