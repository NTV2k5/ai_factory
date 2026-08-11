import {
  Activity, PlayCircle, Clock, CheckCircle2, Bot, ArrowRight,
  ChevronRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  onCreateTicket: () => void;
  onNavigate?: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onCreateTicket, onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* ─── TOP METRIC STAT CARDS (Screenshot 2) ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Projects */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">ACTIVE PROJECTS</p>
            <p className="text-3xl font-black text-foreground mt-2 font-mono">12</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Running Agents */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">RUNNING AGENTS</p>
            <p className="text-3xl font-black text-foreground mt-2 font-mono">3</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <PlayCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PENDING APPROVALS</p>
            <p className="text-3xl font-black text-foreground mt-2 font-mono">5</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">COMPLETED TASKS</p>
            <p className="text-3xl font-black text-foreground mt-2 font-mono">124</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* ─── ACTIVE WORKING AGENTS SECTION (Screenshot 2) ───────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-sky-500" /> Active Working Agents
          </h3>
          <span className="text-xs text-muted-foreground">Click a card to jump to that pipeline step</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: BA Agent */}
          <div 
            onClick={() => onNavigate?.('task-pipeline')}
            className="bg-card border-2 border-emerald-500/50 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md hover:border-emerald-500 transition-all relative overflow-hidden cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> RUNNING
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                1/7
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">BA Agent</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Business Analysis & Validation</p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-foreground group-hover:bg-emerald-500/10 transition-colors">
              <span>Step 1: Check Huly & Requirements</span>
              <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
            </div>
          </div>

          {/* Card 2: Designer Agent */}
          <div 
            onClick={() => onNavigate?.('task-pipeline')}
            className="bg-card border-2 border-purple-500/50 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md hover:border-purple-500 transition-all relative overflow-hidden cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" /> RUNNING
              </span>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                2/7
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Designer Agent</h4>
              <p className="text-xs text-muted-foreground mt-0.5">UI/UX & Design Patterns</p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-foreground group-hover:bg-purple-500/10 transition-colors">
              <span>Step 2: UI/UX Design</span>
              <ArrowRight className="w-4 h-4 text-purple-500 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Card 3: Validate Agent */}
          <div 
            onClick={() => onNavigate?.('task-pipeline')}
            className="bg-card border-2 border-blue-500/50 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md hover:border-blue-500 transition-all relative overflow-hidden cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> RUNNING
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                5/7
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Validate Agent</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Validation & Quality Assurance</p>
            </div>

            <div className="bg-muted/60 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-foreground group-hover:bg-blue-500/10 transition-colors">
              <span>Step 5: Validation & Rules Check</span>
              <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
            </div>
          </div>

        </div>
      </div>

      {/* ─── ACTIVE TASK PIPELINES SECTION (Screenshot 2) ───────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-500" /> Active Task Pipelines
          </h3>
          <button 
            onClick={() => onNavigate?.('task-pipeline')}
            className="text-xs font-bold text-sky-500 hover:text-sky-600 hover:underline cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>

        {/* Task Pipeline Item */}
        <div 
          onClick={() => onNavigate?.('task-pipeline')}
          className="bg-muted/40 border border-border hover:border-sky-400 rounded-xl p-4 space-y-3 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold bg-muted border border-border px-2.5 py-1 rounded-md text-muted-foreground">
                TSK-892
              </span>
              <h4 className="font-bold text-sm text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Upload Doc → JSON Converter
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-500">3/7</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                In Progress
              </span>
            </div>
          </div>

          {/* Segmented Pipeline Progress Bar */}
          <div className="grid grid-cols-7 gap-1.5 h-2">
            <div className="h-full bg-emerald-500 rounded-full" />
            <div className="h-full bg-emerald-500 rounded-full" />
            <div className="h-full bg-sky-500 rounded-full" />
            <div className="h-full bg-muted-foreground/20 rounded-full" />
            <div className="h-full bg-muted-foreground/20 rounded-full" />
            <div className="h-full bg-muted-foreground/20 rounded-full" />
            <div className="h-full bg-muted-foreground/20 rounded-full" />
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Current: <span className="text-foreground font-bold">Code & Rules</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
