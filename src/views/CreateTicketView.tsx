import { PlusCircle, Send, ArrowLeft, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface CreateTicketViewProps {
  onBack?: () => void;
}

const AGENT_TYPES = [
  { value: 'Designer Agent', label: '🎨 Designer Agent', desc: 'UI/UX design, Penpot MCP, component generation' },
  { value: 'BA Agent', label: '📋 BA Agent', desc: 'Business analysis, BPMN diagrams, user stories' },
  { value: 'Validate Agent', label: '🛡️ Validate Agent', desc: 'QA audit, rule engine validation, acceptance criteria' },
  { value: 'Research Agent', label: '🔬 Research Agent', desc: 'Research, information synthesis, competitive analysis' },
];

const PRIORITIES = ['High', 'Medium', 'Low'];
const TYPES = ['Feature', 'Bug Fix', 'Research', 'Spike', 'Documentation'];

export const CreateTicketView: React.FC<CreateTicketViewProps> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [agent, setAgent] = useState('Designer Agent');
  const [priority, setPriority] = useState('Medium');
  const [type, setType] = useState('Feature');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newArtId = `ART-${Math.floor(1205 + Math.random() * 900)}`;
    const newType = agent === 'Designer Agent' ? 'Design' : agent === 'BA Agent' ? 'BA' : 'Code';
    const createdArtifact = {
      id: newArtId,
      name: title,
      type: newType,
      version: 'v1.0',
      status: 'In Review',
      agent,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const saved = localStorage.getItem('agyn_artifacts_list');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('agyn_artifacts_list', JSON.stringify([createdArtifact, ...list]));
    } catch (err) {}

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Ticket Created Successfully!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your task has been dispatched to <strong>{agent}</strong> with <strong>{priority}</strong> priority.
            The agent will begin processing shortly.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 rounded-xl border border-border bg-muted text-foreground text-xs font-bold cursor-pointer hover:bg-muted/80 transition-all"
          >
            Create Another
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-md"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-all cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-primary" /> Create New Ticket
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Submit a task request to an AI Agent for processing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Task Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Design login form with OAuth2 social buttons"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
        </div>

        {/* Agent & Type & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Assign To Agent *</label>
            <div className="space-y-2">
              {AGENT_TYPES.map(a => (
                <label key={a.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${agent === a.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <input type="radio" name="agent" value={a.value} checked={agent === a.value} onChange={() => setAgent(a.value)} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground">{a.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Task Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      priority === p
                        ? p === 'High' ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400'
                          : p === 'Medium' ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                        : 'border-border bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Info */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Selected Agent</span>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-bold text-primary">{agent}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{AGENT_TYPES.find(a => a.value === agent)?.desc}</p>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Priority</span>
                <span className={`font-bold ${priority === 'High' ? 'text-red-500' : priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{priority}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Type</span>
                <span className="font-bold text-foreground">{type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Task Description & Requirements *</label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task in detail. Include context, constraints, and any references..."
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            required
          />
        </div>

        {/* Acceptance Criteria */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Acceptance Criteria (Optional)</label>
          <textarea
            rows={3}
            value={acceptanceCriteria}
            onChange={e => setAcceptanceCriteria(e.target.value)}
            placeholder="- Given... When... Then...&#10;- The UI should match the Figma design with max 5% deviation&#10;- All validation rules must pass"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-mono text-xs"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Dispatch to Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketView;
