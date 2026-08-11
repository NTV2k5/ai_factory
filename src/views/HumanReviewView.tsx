import {
  CheckCircle2, XCircle, Clock, AlertTriangle, Lock, FileText, Bot, Eye
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ReviewItem {
  id: string;
  title: string;
  agent: string;
  type: string;
  createdAt: string;
  description: string;
}

const REVIEW_ITEMS: ReviewItem[] = [
  { id: 'HR-001', title: 'Feature Design Package – Invoice Uploader v3.1', agent: 'Designer Agent', type: 'Design', createdAt: '2025-08-02', description: 'Complete UI package for invoice uploader. MCP commands applied. Pending PO approval.' },
  { id: 'HR-002', title: 'Auth Refactor Architecture Document v1.0', agent: 'BA Agent', type: 'Spec', createdAt: '2025-08-04', description: 'Architecture spec for JWT refresh tokens, OAuth2 Google, SAML and RBAC middleware.' },
  { id: 'HR-003', title: 'JSON Converter Validation Report', agent: 'Validation Agent', type: 'Code', createdAt: '2025-08-03', description: 'Validation audit: 14/15 rules passed. 1 Warning (non-blocking). Score 92/100.' },
  { id: 'HR-004', title: 'Payment Gateway Integration BA Package', agent: 'BA Agent', type: 'BA', createdAt: '2025-08-05', description: 'Stripe v3 SDK integration scope, webhook verification and retry queue analysis.' },
];

type Decision = 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | null;

export const HumanReviewView: React.FC = () => {
  const { isAdmin } = useAuth();
  const [statuses, setStatuses] = useState<Record<string, Decision>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAction = (id: string, action: Decision) => {
    if (!isAdmin) {
      alert("Permission Denied: Only Admin / PO Lead accounts have the authority to transition the status to APPROVED (Human Gatekeeper - P05).");
      return;
    }
    setStatuses(prev => ({ ...prev, [id]: action }));
  };

  const statusDisplay: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    APPROVED: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="w-4 h-4" /> },
    REJECTED: { label: 'Rejected', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: <XCircle className="w-4 h-4" /> },
    CHANGES_REQUESTED: { label: 'Changes Requested', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: <AlertTriangle className="w-4 h-4" /> },
  };

  return (
    <div className="flex flex-col gap-5 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="shrink-0 flex justify-between items-start md:items-center flex-col md:flex-row gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" /> Human Review Queue (Approval Gate)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review, reject, or request modifications for artifacts from BA Agent, Designer Agent & Validation Agent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {REVIEW_ITEMS.filter(i => !statuses[i.id]).length} Pending Review
          </span>
        </div>
      </div>

      {/* Permission Notice (for non-admin) */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3 shadow-sm shrink-0">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Permission Notice (P05 Human Gate Rules):</p>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              You are currently logged in as a <strong>User (Specialist)</strong>. According to rule UAPDF-AIS-001, <strong>APPROVED</strong> status points must be executed by an Admin / PO Lead. You can view statuses or switch to an Admin account in the top-right corner.
            </p>
          </div>
        </div>
      )}

      {/* Review Items */}
      <div className="space-y-3">
        {REVIEW_ITEMS.map(item => {
          const decision = statuses[item.id];
          const ds = decision ? statusDisplay[decision] : null;
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className={`bg-card border rounded-2xl shadow-sm overflow-hidden transition-all ${decision ? 'border-border opacity-75' : 'border-border hover:border-primary/30'}`}>
              <div className="px-5 py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-muted-foreground">{item.id}</p>
                      <p className="font-bold text-sm text-foreground mt-0.5 truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.agent} • {item.type} • {item.createdAt}</p>
                    </div>
                    {ds ? (
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border shrink-0 ${ds.color}`}>
                        {ds.icon} {ds.label}
                      </span>
                    ) : (
                      <span className="text-xs bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <p className="text-xs text-muted-foreground mt-3 bg-muted/40 rounded-xl p-3 border border-border">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-4 flex items-center gap-2 border-t border-border/50 pt-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> {isExpanded ? 'Collapse' : 'View Details'}
                </button>
                <button
                  onClick={() => handleAction(item.id, 'APPROVED')}
                  disabled={!!decision}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    !!decision ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleAction(item.id, 'CHANGES_REQUESTED')}
                  disabled={!!decision}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    !!decision ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground' : 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Request Changes
                </button>
                <button
                  onClick={() => handleAction(item.id, 'REJECTED')}
                  disabled={!!decision}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    !!decision ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground' : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HumanReviewView;
