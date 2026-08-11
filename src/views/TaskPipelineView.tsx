import {
  Upload, CheckCircle2, MoreHorizontal, PauseCircle, RefreshCw, Settings,
  Trash2, Plus, Code2, Database, FileText, ChevronRight, Play, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export const TaskPipelineView: React.FC = () => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isPulledTSK550, setIsPulledTSK550] = useState(false);

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full">
      {/* ─── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Pipeline: Doc to JSON Converter
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            Task ID: <span className="font-mono font-bold text-foreground">TSK-892</span> • Initiated by <span className="font-bold text-foreground">PO</span>
          </p>
        </div>

        {/* Status Pill & Action Menu Dropdown (Screenshot 3) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span>Step 3: Code Generation</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-sm"
              title="Pipeline Actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showActionMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => { setIsGenerating(!isGenerating); setShowActionMenu(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <PauseCircle className="w-4 h-4 text-muted-foreground" />
                  {isGenerating ? 'Pause Pipeline' : 'Resume Pipeline'}
                </button>
                <button
                  onClick={() => setShowActionMenu(false)}
                  className="w-full px-4 py-2.5 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" /> Restart Current Step
                </button>
                <button
                  onClick={() => setShowActionMenu(false)}
                  className="w-full px-4 py-2.5 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" /> Pipeline Settings
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => { alert('Pipeline cancelled.'); setShowActionMenu(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2.5 cursor-pointer font-bold"
                >
                  <Trash2 className="w-4 h-4" /> Cancel Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── SPLIT VIEW: MAIN WORKFLOW STEPS / RIGHT GRAPH CONTEXT ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: WORKFLOW STEPS (Screenshots 1 & 2) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Upload Input Artifacts Container */}
          <div className="border-2 border-dashed border-sky-300 dark:border-sky-800/80 bg-sky-50/40 dark:bg-sky-950/20 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:border-sky-400 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Upload Input Artifacts</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Drag and drop requirements, documents, or Figma links here to start a new pipeline, or add to the current one.
              </p>
            </div>
            <button className="px-4 py-1.5 bg-card border border-border hover:bg-muted text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm">
              + Browse Files
            </button>
          </div>

          {/* STEP 1: Check Holly (Input & Validation) - DONE */}
          <div className="border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Step 1: Check Holly (Input & Validation)</h4>
                  <p className="text-[11px] text-muted-foreground">Completed by BA Agent & PO</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 uppercase">
                DONE
              </span>
            </div>

            {/* Document Card */}
            <div className="bg-card border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground font-mono">invoice_template_v2.docx</p>
                  <p className="text-[10px] text-muted-foreground">2.4 MB • Uploaded 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs font-bold text-sky-500 hover:underline cursor-pointer">
                  View Details
                </button>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  Validated
                </span>
              </div>
            </div>
          </div>

          {/* STEP 2: Architecture Selection - DONE */}
          <div className="border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Step 2: Architecture Selection</h4>
                  <p className="text-[11px] text-muted-foreground">Completed by Architect Agent</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 uppercase">
                DONE
              </span>
            </div>

            {/* Tech Stack Pills & Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full shadow-sm">
                  Python 3.11
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full shadow-sm">
                  FastAPI
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full shadow-sm">
                  Pandas 2.0
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Selected <strong className="text-foreground">Python with FastAPI</strong> for the microservice. This aligns with existing graph patterns and provides optimal performance for document parsing.
              </p>
            </div>
          </div>

          {/* STEP 3: Code & Rules - ACTIVE GENERATING (Screenshot 2) */}
          <div className="border-2 border-sky-500 bg-card rounded-2xl p-5 shadow-lg space-y-4 relative">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">Step 3: Code & Rules</h4>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">Coding Agent is analyzing graph and generating implementation...</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="text-xs font-bold text-sky-500 hover:underline cursor-pointer">
                  Interrupt Agent
                </button>
                <span className="text-[10px] font-mono font-bold bg-sky-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <RefreshCw className="w-3 h-3 animate-spin" /> GENERATING
                </span>
              </div>
            </div>

            {/* Split Box inside Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Left: BUSINESS & TECH RULES */}
              <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">BUSINESS & TECH RULES</span>
                  <button className="text-xs font-bold text-sky-500 hover:underline cursor-pointer">+ Add Rule</button>
                </div>
                <div className="space-y-2">
                  <div className="bg-card border border-border rounded-xl p-3 text-xs text-foreground font-medium shadow-sm">
                    1. Validate file size &lt; 10MB (<span className="text-sky-500 font-bold font-mono">BR-09</span>)
                  </div>
                  <div className="bg-card border border-border rounded-xl p-3 text-xs text-foreground font-medium shadow-sm">
                    2. Follow PEP8 Python code standards
                  </div>
                </div>
              </div>

              {/* Right: Code Editor Preview (converter.py) */}
              <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200 font-mono text-xs flex flex-col">
                <div className="bg-[#111827] px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <Code2 className="w-3.5 h-3.5" /> converter.py
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                </div>
                <div className="p-3.5 overflow-x-auto leading-relaxed text-slate-300">
                  <span className="text-purple-400">def</span> <span className="text-blue-400">doc_to_json</span>(file_path: <span className="text-amber-400">str</span>) -&gt; <span className="text-amber-400">str</span>:<br />
                  &nbsp;&nbsp;<span className="text-slate-500"># Inherited from Graph TSK-412</span><br />
                  &nbsp;&nbsp;content = extract_text(file_path)<br />
                  &nbsp;&nbsp;<span className="text-slate-500"># Apply BR-09 size validation</span><br />
                  &nbsp;&nbsp;validate_size(file_path)<br />
                  &nbsp;&nbsp;<span className="text-emerald-400"># Generating JSON mapping...</span><br />
                  &nbsp;&nbsp;parsed = process_mapping(content)<br />
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> json.dumps(parsed, indent=<span className="text-amber-400">2</span>)
                </div>
              </div>
            </div>

            {/* Bottom Add Instruction */}
            <div className="flex justify-end pt-1">
              <button className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-sm">
                Add Instruction
              </button>
            </div>
          </div>

          {/* STEP 4: System Integration & MCP Binding - PENDING */}
          <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Step 4: System Integration & MCP Binding</h4>
                  <p className="text-[11px] text-muted-foreground">Assigned to Integration Agent & DevOps</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full border border-border uppercase">
                QUEUED
              </span>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>MCP Services: Penpot MCP, Postman Collection API, Knowledge Graph DB</span>
              <button className="text-xs font-bold text-sky-500 hover:underline cursor-pointer">
                View Config
              </button>
            </div>
          </div>

          {/* STEP 5: Validation & Quality Rules Check - PENDING */}
          <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Step 5: Validation & Quality Rules Check</h4>
                  <p className="text-[11px] text-muted-foreground">Assigned to Validate Agent</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full border border-border uppercase">
                QUEUED
              </span>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Rule Engine Validation: BR-09 Size &lt; 10MB, BR-003 Expiry Check, PEP8 Standards</span>
              <button className="text-xs font-bold text-sky-500 hover:underline cursor-pointer">
                Pre-run Check
              </button>
            </div>
          </div>

          {/* STEP 6: Human Review & Security Audit - PENDING */}
          <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Step 6: Human Review & Security Audit</h4>
                  <p className="text-[11px] text-muted-foreground">Assigned to Lead Engineer (Human-In-The-Loop)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full border border-border uppercase">
                PENDING APPROVAL
              </span>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Awaiting code diff inspection & security vulnerability assessment</span>
              <button className="text-xs font-bold text-amber-500 hover:underline cursor-pointer">
                Review Gate
              </button>
            </div>
          </div>

          {/* STEP 7: Automated Deployment & Release - PENDING */}
          <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-3 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Step 7: Automated Deployment & Release</h4>
                  <p className="text-[11px] text-muted-foreground">Assigned to Release Agent (CI/CD)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full border border-border uppercase">
                PENDING
              </span>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Build Docker Container, Run Integration Tests & Deploy to Staging</span>
              <button className="text-xs font-bold text-slate-400 cursor-not-allowed">
                Deploy Lock
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: GRAPH CONTEXT MATCHES (Screenshots 1, 2, 3) */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Database className="w-4 h-4 text-purple-500" /> Graph Context Matches
            </h3>

            {/* Info Card */}
            <div className="bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl p-3.5 space-y-1">
              <p className="text-xs font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-sky-500" /> Reusable Context Found
              </p>
              <p className="text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed">
                Graph nodes matching the current architecture and intent have been discovered.
              </p>
            </div>

            {/* Match Card 1: TSK-412 (PULLED) */}
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/80 rounded-xl p-3.5 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">TSK-412</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  PULLED
                </span>
              </div>
              <p className="font-bold text-xs text-foreground">PDF/Doc Upload Module</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">DIRECT DEPENDENCY</p>
            </div>

            {/* Match Card 2: TSK-550 (CONCEPTUAL MATCH) */}
            <div className="bg-card border border-sky-200 dark:border-sky-800/80 rounded-xl p-3.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sky-500 text-xs">TSK-550</span>
              </div>
              <p className="font-bold text-xs text-foreground">JSON Schema Validator</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">CONCEPTUAL MATCH</p>

              <button
                onClick={() => setIsPulledTSK550(!isPulledTSK550)}
                className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isPulledTSK550
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50'
                }`}
              >
                {isPulledTSK550 ? '✓ Context Pulled' : '📥 Pull Context to Agent'}
              </button>
            </div>

            {/* Match Card 3: BR-09 (PULLED) */}
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/80 rounded-xl p-3.5 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">BR-09</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                  PULLED
                </span>
              </div>
              <p className="font-bold text-xs text-foreground">10MB Max File Size</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">BUSINESS RULE</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskPipelineView;
