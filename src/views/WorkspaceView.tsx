import {
  FolderKanban, Download, Eye, Filter, ArrowUpDown, Search,
  ExternalLink, Edit3, Bot, Sparkles, Send, AlertTriangle, CheckCircle2,
  XCircle, Info, Layers, RefreshCw, Wand2, Layout, Smartphone,
  Monitor, Tablet, X, Zap, FileText, ShieldCheck, HelpCircle,
  GitBranch, FileCheck, AlertOctagon, UserCheck, Check, Lock, Sliders, CheckSquare,
  Palette, SlidersHorizontal, PlusCircle, Plus, Play, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import agynThreadService from '../services/threadService';
import agynChatService from '../services/chatService';

export interface Artifact {
  id: string;
  name: string;
  type: 'Design' | 'Code' | 'Spec' | 'BA';
  version: string;
  status: 'Approved' | 'In Review' | 'Draft';
  agent: 'Designer Agent' | 'BA Agent' | 'Validate Agent';
  date: string;
  penpotUrl?: string;
  artboardName?: string;
  lastMcpAction?: string;
  baScopeIn?: string[];
  baScopeOut?: string[];
  validationOutcome?: 'passed' | 'passed_with_warnings' | 'failed';
  validationScore?: number;
}

const ARTIFACTS: Artifact[] = [
  {
    id: 'ART-1201',
    name: 'Feature Design Package – Invoice Uploader',
    type: 'Design',
    version: 'v3.1',
    status: 'Approved',
    agent: 'Designer Agent',
    date: '2025-08-02',
    penpotUrl: 'https://penpot.app/#/workspace/invoice-uploader-v3',
    artboardName: 'Invoice Dropzone & Document Table',
    lastMcpAction: 'penpot_update_colors(target="Dropzone", primary="#0284c7")'
  },
  {
    id: 'ART-1202',
    name: 'JSON Converter Python Module',
    type: 'Code',
    version: 'v2.0',
    status: 'In Review',
    agent: 'Validate Agent',
    date: '2025-08-03',
    validationOutcome: 'passed_with_warnings',
    validationScore: 92
  },
  {
    id: 'ART-1203',
    name: 'Auth Refactor Architecture Document',
    type: 'Spec',
    version: 'v1.0',
    status: 'Draft',
    agent: 'BA Agent',
    date: '2025-08-04',
    baScopeIn: ['JWT Refresh tokens', 'OAuth2 Google & SAML', 'RBAC Middleware'],
    baScopeOut: ['Biometric Passkeys (Phase 2)', 'Multi-tenant DB isolation']
  },
  {
    id: 'ART-1204',
    name: 'Payment Gateway Integration BA Package',
    type: 'BA',
    version: 'v1.2',
    status: 'Approved',
    agent: 'BA Agent',
    date: '2025-08-05',
    baScopeIn: ['Stripe v3 SDK', 'Webhook verification', 'Retry queue'],
    baScopeOut: ['PayPal (Phase 3)']
  },
];

interface ChatMessage { id: string; sender: 'user' | 'agent'; text: string; timestamp: string; }

const statusColors: Record<string, string> = {
  Approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  'In Review': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Draft: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

const typeColors: Record<string, string> = {
  Design: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Code: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Spec: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  BA: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};

export const WorkspaceView: React.FC = () => {
  const { isAdmin } = useAuth();

  // Active workbench & direct editor modal - Default to null so page opens to Storage List
  const [activeWorkbenchArtifact, setActiveWorkbenchArtifact] = useState<Artifact | null>(null);
  const [showPenpotModal, setShowPenpotModal] = useState(false);
  const [designerMode, setDesignerMode] = useState<'feature' | 'ds'>('feature');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Chat History per Agent
  const [designChatPrompt, setDesignChatPrompt] = useState('');
  const [baChatPrompt, setBaChatPrompt] = useState('');
  const [valChatPrompt, setValChatPrompt] = useState('');

  const [designMessages, setDesignMessages] = useState<ChatMessage[]>([
    {
      id: 'd-msg-1',
      sender: 'user',
      text: 'Chuyển toàn bộ Artboard màn hình sang Dark Theme với nền dark slate (#0f172a).',
      timestamp: '05:17 PM'
    },
    {
      id: 'd-msg-2',
      sender: 'agent',
      text: 'Đã chuyển đổi biến thiết kế Penpot sang Dark Theme mode (#0f172a).',
      timestamp: '05:17 PM'
    }
  ]);

  const [baMessages, setBaMessages] = useState<ChatMessage[]>([
    {
      id: 'ba-msg-1',
      sender: 'user',
      text: 'Thêm Business Rule BR-003 quy định chỉ chấp nhận hóa đơn PDF có dung lượng dưới 25MB và chưa quá hạn 90 ngày.',
      timestamp: '05:15 PM'
    },
    {
      id: 'ba-msg-2',
      sender: 'agent',
      text: 'Đã ghi nhận yêu cầu nghiệp vụ: "Thêm Business Rule BR-003 quy định chỉ chấp nhận hóa đơn PDF có dung lượng dưới 25MB và chưa quá hạn 90 ngày.". Tôi đã cập nhật Gói phân tích BA Package (v2.2) với sơ đồ BPMN touchpoint tương ứng.',
      timestamp: '05:15 PM'
    }
  ]);

  const [valMessages, setValMessages] = useState<ChatMessage[]>([
    {
      id: 'val-msg-1',
      sender: 'user',
      text: 'Liệt kê các phát hiện lỗi Error/Blocker về thiếu trạng thái Error State trên giao diện Penpot.',
      timestamp: '05:16 PM'
    },
    {
      id: 'val-msg-2',
      sender: 'agent',
      text: 'Đã thực thi kiểm tra Rule Engine cho: "Liệt kê các phát hiện lỗi Error/Blocker về thiếu trạng thái Error State trên giao diện Penpot.". Kết quả: Passed 14/15 rules. Phát hiện 1 Warning chưa blocker. Đã xuất Validation Report v1.1.0 Canonical.',
      timestamp: '05:16 PM'
    }
  ]);

  // Task Dispatcher State
  const [artifactsList, setArtifactsList] = useState<Artifact[]>(() => {
    try {
      const saved = localStorage.getItem('agyn_artifacts_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ARTIFACTS;
  });
  const [showTaskDispatcher, setShowTaskDispatcher] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAgent, setTaskAgent] = useState<'Designer Agent' | 'BA Agent' | 'Validate Agent'>('Designer Agent');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskInstruction, setTaskInstruction] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleDispatchTask = async () => {
    if (!taskTitle.trim() || !taskInstruction.trim()) {
      alert("Vui lòng nhập đầy đủ Tên Task và Yêu cầu chi tiết.");
      return;
    }
    try {
      setIsDispatching(true);
      await agynThreadService.postUserMessageToThread(
        `[TASK DISPATCH: ${taskTitle}] Priority: ${taskPriority}. Instruction: ${taskInstruction}`,
        taskAgent
      );
      const newArtId = `ART-${Math.floor(1205 + Math.random() * 900)}`;
      const newType = taskAgent === 'Designer Agent' ? 'Design' : taskAgent === 'BA Agent' ? 'BA' : 'Code';
      const createdArtifact: Artifact = {
        id: newArtId,
        name: taskTitle,
        type: newType as any,
        version: 'v1.0',
        status: 'In Review',
        agent: taskAgent,
        date: new Date().toISOString().split('T')[0],
      };

      setArtifactsList(prev => {
        const next = [createdArtifact, ...prev];
        try {
          localStorage.setItem('agyn_artifacts_list', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Initialize fresh chat stream for new task
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (taskAgent === 'Validate Agent') {
        setValMessages([
          {
            id: `val-init-${Date.now()}`,
            sender: 'agent',
            text: `Chào bạn! Tôi là Validation Agent. Tôi vừa nhận Task mới "${taskTitle}" (${taskInstruction}). Tôi đã sẵn sàng hỗ trợ bạn kiểm tra Rule Engine và Audit cho task này!`,
            timestamp: currentTime,
          }
        ]);
      } else if (taskAgent === 'BA Agent') {
        setBaMessages([
          {
            id: `ba-init-${Date.now()}`,
            sender: 'agent',
            text: `Chào bạn! Tôi là BA Agent. Tôi vừa nhận Task mới "${taskTitle}" (${taskInstruction}). Bạn cần phân tích User Stories hay định nghĩa BPMN touchpoints nào?`,
            timestamp: currentTime,
          }
        ]);
      } else {
        setDesignMessages([
          {
            id: `des-init-${Date.now()}`,
            sender: 'agent',
            text: `Chào bạn! Tôi là Designer Agent. Tôi vừa nhận Task mới "${taskTitle}" (${taskInstruction}). Hãy nhập yêu cầu thiết kế UI/UX hoặc lệnh Penpot MCP cho tôi!`,
            timestamp: currentTime,
          }
        ]);
      }

      setNotification(`Đã tạo Task "${taskTitle}" thành công và khởi tạo cuộc hội thoại mới với ${taskAgent}!`);
      setTimeout(() => setNotification(null), 4000);
      setActiveWorkbenchArtifact(createdArtifact);
      setTaskTitle('');
      setTaskInstruction('');
      setShowTaskDispatcher(false);
    } catch (e: any) {
      console.warn("Task Dispatch notice:", e?.message);
    } finally {
      setIsDispatching(false);
    }
  };

  // ─── Real-time Chat Service Integration ───────────────────────────────
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Initialize Chat (Bước 1: CreateChat khi mở workbench)
  useEffect(() => {
    if (!activeWorkbenchArtifact) return;
    let unsubSubscribe: (() => void) | undefined;
    let pollInterval: any;

    const initChat = async () => {
      try {
        const agentId = activeWorkbenchArtifact.agent.toLowerCase().replace(/\s+/g, '-');
        const res = await agynChatService.createChat(agentId);
        if (res?.chat?.id) {
          const chatId = res.chat.id;
          setActiveChatId(chatId);

          // Bước 3: Subscribe streaming real-time
          unsubSubscribe = await agynChatService.subscribe(chatId, (payload) => {
            if (payload?.body) {
              const newMsg: ChatMessage = {
                id: payload.id || `msg-${Date.now()}`,
                sender: 'agent',
                text: payload.body,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              if (activeWorkbenchArtifact.agent === 'BA Agent') {
                setBaMessages(prev => [...prev, newMsg]);
              } else if (activeWorkbenchArtifact.agent === 'Validate Agent') {
                setValMessages(prev => [...prev, newMsg]);
              } else {
                setDesignMessages(prev => [...prev, newMsg]);
              }
            }
          });

          // Bước 3: Polling GetMessages (poll mỗi 1s cho nhanh theo lựa chọn)
          pollInterval = setInterval(async () => {
            try {
              const msgRes = await agynChatService.getMessages(chatId, 20);
              if (msgRes?.messages && msgRes.messages.length > 0) {
                // Filter new agent messages
                const agentMsgs = msgRes.messages.filter(m => m.senderId && m.senderId.includes('agent'));
                if (agentMsgs.length > 0) {
                  const latestMsg = agentMsgs[agentMsgs.length - 1];
                  const formattedMsg: ChatMessage = {
                    id: latestMsg.id,
                    sender: 'agent',
                    text: latestMsg.body,
                    timestamp: new Date(latestMsg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  };
                  if (activeWorkbenchArtifact.agent === 'BA Agent') {
                    setBaMessages(prev => (prev.some(m => m.id === formattedMsg.id) ? prev : [...prev, formattedMsg]));
                  } else if (activeWorkbenchArtifact.agent === 'Validate Agent') {
                    setValMessages(prev => (prev.some(m => m.id === formattedMsg.id) ? prev : [...prev, formattedMsg]));
                  } else {
                    setDesignMessages(prev => (prev.some(m => m.id === formattedMsg.id) ? prev : [...prev, formattedMsg]));
                  }
                }
              }
            } catch (e) {
              // Ignore polling failure in offline mode
            }
          }, 1000);
        }
      } catch (e: any) {
        console.warn("CreateChat init notice:", e?.message);
      }
    };

    initChat();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (unsubSubscribe) unsubSubscribe();
    };
  }, [activeWorkbenchArtifact]);

  // Bước 2: SendMessage Handlers
  const handleSendDesignMessage = async (customText?: string) => {
    const text = customText || designChatPrompt;
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `d-u-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setDesignMessages(prev => [...prev, userMsg]);
    if (!customText) setDesignChatPrompt('');

    // Call SendMessage API
    if (activeChatId) {
      try {
        await agynChatService.sendMessage(activeChatId, text);
      } catch (e: any) {
        console.warn("SendMessage API call notice:", e?.message);
      }
    }

    // Agent response simulation fallback
    setTimeout(() => {
      const agentMsg: ChatMessage = { id: `d-a-${Date.now()}`, sender: 'agent', text: `Đã thực thi yêu cầu Penpot MCP: "${text}". Đã cập nhật Artboard thành công.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setDesignMessages(prev => (prev.some(m => m.text === agentMsg.text) ? prev : [...prev, agentMsg]));
    }, 800);
  };

  const handleSendBaMessage = async (customText?: string) => {
    const text = customText || baChatPrompt;
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `ba-u-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setBaMessages(prev => [...prev, userMsg]);
    if (!customText) setBaChatPrompt('');

    if (activeChatId) {
      try {
        await agynChatService.sendMessage(activeChatId, text);
      } catch (e: any) {
        console.warn("SendMessage API call notice:", e?.message);
      }
    }

    setTimeout(() => {
      const agentMsg: ChatMessage = { id: `ba-a-${Date.now()}`, sender: 'agent', text: `Đã ghi nhận yêu cầu nghiệp vụ: "${text}". Đã cập nhật Gói phân tích BA Package.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setBaMessages(prev => (prev.some(m => m.text === agentMsg.text) ? prev : [...prev, agentMsg]));
    }, 800);
  };

  const handleSendValMessage = async (customText?: string) => {
    const text = customText || valChatPrompt;
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `val-u-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setValMessages(prev => [...prev, userMsg]);
    if (!customText) setValChatPrompt('');

    if (activeChatId) {
      try {
        await agynChatService.sendMessage(activeChatId, text);
      } catch (e: any) {
        console.warn("SendMessage API call notice:", e?.message);
      }
    }

    setTimeout(() => {
      const agentMsg: ChatMessage = { id: `val-a-${Date.now()}`, sender: 'agent', text: `Đã thực thi kiểm tra Rule Engine cho: "${text}". Kết quả: Passed 14/15 rules. Phát hiện 1 Warning.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setValMessages(prev => (prev.some(m => m.text === agentMsg.text) ? prev : [...prev, agentMsg]));
    }, 800);
  };

  const filtered = artifactsList.filter(a => {
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.agent.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Main Header & Status Badges */}
      <div className="shrink-0 flex justify-between items-start md:items-center flex-col md:flex-row gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Artifact Storage & Agents Factory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quản lý tất cả sản phẩm của BA Agent, Designer Agent (Penpot Editor) & Validation Agent.
          </p>
        </div>

        {/* Action Button & System Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowTaskDispatcher(!showTaskDispatcher)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" /> {showTaskDispatcher ? 'Đóng Task Dispatcher' : '+ Tạo Task Mới & Chọn Agent'}
          </button>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> BA Agent Active
          </span>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Designer Agent + Penpot MCP
          </span>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Validation Agent Audit
          </span>
        </div>
      </div>

      {/* Main Content: Interactive Workbench OR Storage Table */}
      {activeWorkbenchArtifact ? (
        <div className="bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col flex-1 min-h-0 overflow-hidden p-2">

          {/* ─── WORKBENCH TOP BANNER ──────────────────────────────────────── */}
          <div className="bg-slate-300/50 dark:bg-slate-800/60 rounded-xl px-5 py-3 flex items-center justify-between gap-4 shrink-0 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setActiveWorkbenchArtifact(null)}
                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 text-xs"
                title="Đóng Workbench"
              >
                ✕
              </button>

              {/* Banner Details by Workbench Type */}
              {activeWorkbenchArtifact.agent === 'BA Agent' && (
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Business Analysis Package: {activeWorkbenchArtifact.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Version: {activeWorkbenchArtifact.version} • Status: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeWorkbenchArtifact.status}</span>
                  </p>
                </div>
              )}

              {activeWorkbenchArtifact.agent === 'Validate Agent' && (
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Validation Report Audit: {activeWorkbenchArtifact.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ruleset: v1.1.0 • Scope: Coverage & Pre-conditions
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase tracking-wider">
                    Outcome: PASSED WITH WARNINGS
                  </span>
                </div>
              )}

              {activeWorkbenchArtifact.agent === 'Designer Agent' && (
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-2 py-0.5 rounded-md">
                      {activeWorkbenchArtifact.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {activeWorkbenchArtifact.name} <span className="text-xs font-normal text-slate-500">({activeWorkbenchArtifact.version})</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Artboard: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeWorkbenchArtifact.artboardName || 'Invoice Dropzone & Document Table'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {activeWorkbenchArtifact.agent === 'Designer Agent' && (
                <>
                  <button
                    onClick={() => setDesignerMode('feature')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      designerMode === 'feature' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Feature Design Mode
                  </button>
                  <button
                    onClick={() => setDesignerMode('ds')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      designerMode === 'ds' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Design System Setup Mode
                  </button>
                  <button
                    onClick={() => setShowPenpotModal(true)}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    🚀 Mở Penpot Trực Tiếp
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveWorkbenchArtifact(null)}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs rounded-full transition-all cursor-pointer"
              >
                {activeWorkbenchArtifact.agent === 'BA Agent' ? 'Đóng BA Workbench' : 'Đóng Workbench'}
              </button>
            </div>
          </div>

          {/* Sub-bar for Designer Agent */}
          {activeWorkbenchArtifact.agent === 'Designer Agent' && (
            <div className="px-3 py-1.5 mb-2 flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 gap-2 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  ✓ BA Package: APPROVED (ART-1204 v2.1)
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  ✓ Design System: ACTIVE (v1.2.0)
                </span>
                <span className="text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
                  ⚙️ Penpot AI Draft Zone: Authorized
                </span>
              </div>
              <span className="text-[10px] font-mono bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 px-2.5 py-0.5 rounded-md font-bold">
                Docx Spec UAPDF-AIS-001 Compliant
              </span>
            </div>
          )}

          {/* ─── WORKBENCH SPLIT VIEW (LEFT CONTENT / RIGHT CHAT) ───────────── */}
          <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden">

            {/* ─── LEFT PANEL (BA WORKBENCH) ─────────────────────────────────── */}
            {activeWorkbenchArtifact.agent === 'BA Agent' && (
              <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-0">
                {/* Feature Scope Definition Box */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Feature Scope Definition (F-001)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] mb-2">IN SCOPE</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> JWT Refresh tokens
                        </li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> OAuth2 Google & SAML
                        </li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> RBAC Middleware
                        </li>
                      </ul>
                    </div>
                    <div className="bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl p-3">
                      <p className="font-bold text-red-800 dark:text-red-300 uppercase tracking-wider text-[10px] mb-2">OUT OF SCOPE</p>
                      <ul className="space-y-1.5">
                        <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> Biometric Passkeys (Phase 2)
                        </li>
                        <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> Multi-tenant DB isolation
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* User Stories & Acceptance Criteria Matrix Box */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> User Stories & Acceptance Criteria Matrix
                  </h4>

                  {/* US 001 */}
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">US-001: Upload Invoice Document</span>
                      <span className="text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-800">
                        Linked: TASK-01
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      As a Finance Administrator, I want to drag & drop invoices so that line items are automatically parsed.
                    </p>
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-slate-100">AC-001 (Given-When-Then):</span> Given a valid PDF invoice under 25MB, When dropped into Dropzone, Then parse vendor name, total tax, and items within 3s.
                    </div>
                  </div>

                  {/* US 002 */}
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">US-002: Review Tax Calculations</span>
                      <span className="text-[10px] font-mono bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-800">
                        Linked: TASK-02
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      As an Accountant, I want to review extracted tax figures so that I can correct any parsing mismatch.
                    </p>
                  </div>
                </div>

                {/* BPMN UI Touchpoints Box */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-teal-600 dark:text-teal-400" /> BPMN UI Touchpoints (Workflow Mapping)
                  </h4>
                </div>
              </div>
            )}

            {/* ─── LEFT PANEL (VALIDATION WORKBENCH) ──────────────────────────── */}
            {activeWorkbenchArtifact.agent === 'Validate Agent' && (
              <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-0">
                {/* Validation Coverage Summary Box */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Validation Coverage Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">USER STORIES</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">4 / 4 Covered</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BPMN UI NODES</p>
                      <p className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">6 / 7 Covered</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">REQUIRED STATES</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">3 / 4 States</p>
                    </div>
                  </div>
                </div>

                {/* Validation Findings & Evidence Box */}
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-red-500" /> Validation Findings & Evidence (Rule Engine)
                  </h4>

                  {/* Error UX-001 */}
                  <div className="bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-4 h-4" /> UX-001 (Severity: ERROR)
                      </div>
                      <span className="text-[10px] font-mono bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded border border-red-300 dark:border-red-700">
                        Rule: UX-FLOW-004
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Màn hình Dropzone (SCR-01) chưa định nghĩa Error State khi upload file vượt 25MB.
                    </p>
                    <div className="bg-white/80 dark:bg-slate-900 border border-red-200 dark:border-red-800/60 rounded-lg p-2.5 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      Evidence: Frame #frame-invoice-99 chỉ chứa 'default' và 'loading' states; thiếu 'error_invalid_file'.
                    </div>
                  </div>

                  {/* Warning BR-003 */}
                  <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <Info className="w-4 h-4" /> BR-003 (Severity: WARNING)
                      </div>
                      <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                        Rule: BR-RETRY-001
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold">
                      Chưa bổ sung quy tắc tự động retry khi kết nối OCR service gián đoạn.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── LEFT PANEL (DESIGNER WORKBENCH) ────────────────────────────── */}
            {activeWorkbenchArtifact.agent === 'Designer Agent' && (
              <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-0">
                {designerMode === 'feature' ? (
                  <>
                    {/* Viewport & State Controls */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs gap-2 flex-wrap shadow-sm">
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        <button className="px-3 py-1 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <Monitor className="w-3.5 h-3.5" /> Desktop
                        </button>
                        <button className="px-3 py-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer">
                          <Tablet className="w-3.5 h-3.5" /> Tablet
                        </button>
                        <button className="px-3 py-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer">
                          <Smartphone className="w-3.5 h-3.5" /> Mobile
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">State:</span>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                          <button className="px-2.5 py-0.5 bg-sky-600 text-white font-bold rounded text-[11px] cursor-pointer">Default</button>
                          <button className="px-2.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-[11px] cursor-pointer">Loading</button>
                          <button className="px-2.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-[11px] cursor-pointer">Error</button>
                          <button className="px-2.5 py-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-[11px] cursor-pointer">Success</button>
                        </div>
                      </div>
                    </div>

                    {/* Penpot Artboard Interactive Canvas */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-white">
                      {/* Window Frame Bar */}
                      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                          </div>
                          <span className="text-xs font-mono text-slate-400 ml-2">
                            Penpot Artboard: {activeWorkbenchArtifact.artboardName || 'Invoice Dropzone & Document Table'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700 font-bold">
                          AI Draft Zone • Penpot Engine v2.4
                        </span>
                      </div>

                      {/* Canvas Artboard Content */}
                      <div className="p-8 bg-[#0f172a] min-h-[260px] flex flex-col justify-center items-center">
                        <div className="w-full max-w-lg space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <div>
                              <h4 className="font-bold text-base text-white">Invoice Processing Suite</h4>
                              <p className="text-xs text-slate-400">Upload, parse & convert invoices automatically</p>
                            </div>
                            <button className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-sky-500 transition-all cursor-pointer">
                              <Download className="w-3.5 h-3.5" /> Export Invoice PDF
                            </button>
                          </div>

                          {/* Dropzone Container */}
                          <div className="border-2 border-dashed border-sky-500/50 bg-sky-950/20 rounded-2xl p-8 text-center space-y-2 hover:border-sky-400 transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                              <Layers className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-sm text-slate-200">Drag & drop your Invoice document here</p>
                            <p className="text-xs text-slate-400">Supports PDF, PNG, JPG up to 25MB</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Design System Proposal Banner */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Design System Proposal:</span>
                        <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">DS-PROP-01 (DropzoneProgress)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-800">
                        Pending Review
                      </span>
                    </div>
                  </>
                ) : (
                  /* Design System Setup Mode (Screenshot 4) */
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <Palette className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" /> UI/UX Design System Package (v1.2.0 Active)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                        <p className="font-mono font-bold text-slate-400 uppercase text-[10px]">PRIMARY PALETTE TOKENS</p>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#0284c7] ring-2 ring-sky-300" />
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#0284c7 (Sky 600)</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                        <p className="font-mono font-bold text-slate-400 uppercase text-[10px]">TYPOGRAPHY SCALE TOKENS</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Inter / JetBrains Mono</p>
                      </div>
                    </div>

                    <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-4 space-y-1.5">
                      <p className="font-bold text-purple-800 dark:text-purple-300 text-xs">Accessibility & Accessibility Matrix (AA Standard):</p>
                      <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
                        Tỷ lệ tương phản Contrast Ratio &gt; 4.5:1, Kích thước touch target tối thiểu 44x44px, hỗ trợ screen reader labels đầy đủ.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── RIGHT PANEL: AGENT CHAT & SUGGESTED PROMPTS ────────────────── */}
            <div className="w-full md:w-96 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col min-h-[420px] shadow-sm shrink-0">

              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${
                    activeWorkbenchArtifact.agent === 'BA Agent' ? 'bg-teal-600' :
                    activeWorkbenchArtifact.agent === 'Validate Agent' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {activeWorkbenchArtifact.agent} <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {activeWorkbenchArtifact.agent === 'BA Agent' ? 'Business Requirements & BPMN Spec Generator' :
                       activeWorkbenchArtifact.agent === 'Validate Agent' ? 'Rule Engine & Evidence-Based Audit' :
                       'Penpot MCP Controller & Guardrails'}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  activeWorkbenchArtifact.agent === 'BA Agent' ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' :
                  activeWorkbenchArtifact.agent === 'Validate Agent' ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                  'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                }`}>
                  {activeWorkbenchArtifact.agent === 'BA Agent' ? 'BA Package v2.1' :
                   activeWorkbenchArtifact.agent === 'Validate Agent' ? 'Ruleset v1.1.0' :
                   'Penpot MCP v2.4'}
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {(activeWorkbenchArtifact.agent === 'BA Agent' ? baMessages :
                  activeWorkbenchArtifact.agent === 'Validate Agent' ? valMessages :
                  designMessages).map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-400 mb-1">
                      {msg.sender === 'user' ? `Bạn • ${msg.timestamp}` : `${activeWorkbenchArtifact.agent} • ${msg.timestamp}`}
                    </span>
                    <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      msg.sender === 'user'
                        ? activeWorkbenchArtifact.agent === 'BA Agent' ? 'bg-teal-600 text-white rounded-br-sm' :
                          activeWorkbenchArtifact.agent === 'Validate Agent' ? 'bg-blue-600 text-white rounded-br-sm' :
                          'bg-sky-600 text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-800'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Prompt Chips */}
              <div className="px-3 pt-2 pb-1 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/40">
                <p className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {activeWorkbenchArtifact.agent === 'BA Agent' ? 'Gợi ý yêu cầu BA Agent:' :
                   activeWorkbenchArtifact.agent === 'Validate Agent' ? 'Gợi ý yêu cầu Validation Agent:' :
                   'Gợi ý chuẩn Penpot MCP:'}
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  {activeWorkbenchArtifact.agent === 'BA Agent' && (
                    <>
                      <button onClick={() => handleSendBaMessage('Thêm Business Rule BR-003')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors shrink-0 cursor-pointer">
                        📌 Bổ sung Business Rule BR-003
                      </button>
                      <button onClick={() => handleSendBaMessage('Tạo Alternate Flow & Exception')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors shrink-0 cursor-pointer">
                        🔄 Tạo Alternate Flow & Exception
                      </button>
                    </>
                  )}
                  {activeWorkbenchArtifact.agent === 'Validate Agent' && (
                    <>
                      <button onClick={() => handleSendValMessage('Liệt kê các phát hiện lỗi Error/Blocker')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors shrink-0 cursor-pointer">
                        ⚡ Kiểm tra Lỗi Blocker & Error
                      </button>
                      <button onClick={() => handleSendValMessage('Kiểm tra Schema Compatibility')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors shrink-0 cursor-pointer">
                        ⚡ Kiểm tra Schema Compatibility
                      </button>
                    </>
                  )}
                  {activeWorkbenchArtifact.agent === 'Designer Agent' && (
                    <>
                      <button onClick={() => handleSendDesignMessage('Chuyển màu primary sang #10b981')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors shrink-0 cursor-pointer">
                        🎨 #10b981 (Emerald)
                      </button>
                      <button onClick={() => handleSendDesignMessage('Thêm Nút "Export PDF"')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors shrink-0 cursor-pointer">
                        ✨ Nút "Export PDF"
                      </button>
                      <button onClick={() => handleSendDesignMessage('Chuyển toàn bộ sang Chế độ Dark Mode')} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors shrink-0 cursor-pointer">
                        🌙 Chế độ Dark Mode
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={
                    activeWorkbenchArtifact.agent === 'BA Agent' ? baChatPrompt :
                    activeWorkbenchArtifact.agent === 'Validate Agent' ? valChatPrompt :
                    designChatPrompt
                  }
                  onChange={e => {
                    if (activeWorkbenchArtifact.agent === 'BA Agent') setBaChatPrompt(e.target.value);
                    else if (activeWorkbenchArtifact.agent === 'Validate Agent') setValChatPrompt(e.target.value);
                    else setDesignChatPrompt(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (activeWorkbenchArtifact.agent === 'BA Agent') handleSendBaMessage();
                      else if (activeWorkbenchArtifact.agent === 'Validate Agent') handleSendValMessage();
                      else handleSendDesignMessage();
                    }
                  }}
                  placeholder={
                    activeWorkbenchArtifact.agent === 'BA Agent' ? 'Nhập yêu cầu bổ sung nghiệp vụ BA...' :
                    activeWorkbenchArtifact.agent === 'Validate Agent' ? 'Nhập yêu cầu kiểm tra validation...' :
                    'Nhập yêu cầu sửa Penpot...'
                  }
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
                <button
                  onClick={() => {
                    if (activeWorkbenchArtifact.agent === 'BA Agent') handleSendBaMessage();
                    else if (activeWorkbenchArtifact.agent === 'Validate Agent') handleSendValMessage();
                    else handleSendDesignMessage();
                  }}
                  className={`w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0 ${
                    activeWorkbenchArtifact.agent === 'BA Agent' ? 'bg-teal-600 hover:bg-teal-500' :
                    activeWorkbenchArtifact.agent === 'Validate Agent' ? 'bg-blue-600 hover:bg-blue-500' :
                    'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ─── ARTIFACT STORAGE TABLE VIEW ──────────────────────────────────── */
        <>
          {/* Task Dispatcher Card (Expandable) */}
          {showTaskDispatcher && (
            <div className="bg-card border-2 border-primary/40 rounded-2xl p-5 shadow-xl animate-in slide-in-from-top-4 duration-300 shrink-0 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">Create New Task & Select Agent</h3>
                    <p className="text-xs text-muted-foreground">Khởi tạo Yêu cầu công việc và giao trực tiếp cho Agent qua Agyn ConnectRPC Gateway</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                  ConnectRPC Task Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold text-muted-foreground uppercase tracking-wider mb-1">Task Title *</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="Ví dụ: Design user interface for new voucher feature and upload invoice dropzone..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-bold text-muted-foreground uppercase tracking-wider mb-1">Select Agent *</label>
                  <select
                    value={taskAgent}
                    onChange={e => setTaskAgent(e.target.value as any)}
                    className="w-full border border-border rounded-xl px-4 py-2.5 bg-background font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="Designer Agent">Designer Agent (UI/UX Design & Penpot MCP)</option>
                    <option value="BA Agent">BA Agent (Business Analysis & BPMN Modeling)</option>
                    <option value="Validate Agent">Validate Agent (Validation & QA Audit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold text-muted-foreground uppercase tracking-wider mb-1">Detailed Description & Requirements *</label>
                  <textarea
                    rows={3}
                    value={taskInstruction}
                    onChange={e => setTaskInstruction(e.target.value)}
                    placeholder="Enter detailed requirements, acceptance criteria, business rules, or specific instructions for the agent..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 bg-background font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block font-bold text-muted-foreground uppercase tracking-wider mb-1">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={e => setTaskPriority(e.target.value as any)}
                      className="w-full border border-border rounded-xl px-4 py-2.5 bg-background font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      onClick={() => setShowTaskDispatcher(false)}
                      className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDispatchTask}
                      disabled={isDispatching}
                      className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-current" /> {isDispatching ? 'Running...' : 'Run This Task'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4 shrink-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search artifacts by name, ID, agent, or type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {['All', 'Approved', 'In Review', 'Draft'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${filterStatus === s ? 'bg-sky-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-background border border-border rounded-lg text-xs font-bold px-3 py-1.5 text-foreground focus:outline-none cursor-pointer"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Artifacts Storage Table */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    {['ID', 'Name', 'Type', 'Version', 'Status', 'Agent', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(art => (
                    <tr key={art.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-3 font-mono font-bold text-muted-foreground">{art.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                        <p className="truncate font-bold">{art.name}</p>
                        {art.penpotUrl && (
                          <a href={art.penpotUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 mt-0.5">
                            <ExternalLink className="w-2.5 h-2.5" /> Open in Penpot
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${typeColors[art.type]}`}>{art.type}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{art.version}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[art.status]}`}>{art.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{art.agent}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{art.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setActiveWorkbenchArtifact(art)}
                            className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Mở Workbench"
                          >
                            <Zap className="w-3 h-3" /> Mở Workbench
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── PENPOT DIRECT EDITOR MODAL (Screenshot 5) ──────────────────────── */}
      {showPenpotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                  P
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Penpot Direct Editor: Feature Design Package – Invoice Uploader</h3>
                  <p className="text-[11px] font-mono text-slate-400">URL: https://penpot.app/#/workspace/invoice-uploader-v3</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://penpot.app/#/workspace/invoice-uploader-v3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                >
                  🚀 Mở trong Penpot Tab Mới
                </a>
                <button
                  onClick={() => setShowPenpotModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Sub-bar */}
            <div className="px-6 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Canvas Workspace</span> • <span className="text-white font-medium">Artboard: Invoice Dropzone & Document Table</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">🟢 Sync Status: Active</span>
                <span className="text-slate-400">Penpot MCP v2.4</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">P</span>
                      Feature Design Package – Invoice Uploader
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Trực tiếp chỉnh sửa các lớp (Layers), Shape, Color Palette trên Penpot Canvas</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-300">
                      Human Edit Mode
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-600">v3.1</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <p className="font-mono font-bold text-slate-400 text-[10px] uppercase">PRIMARY TOKEN COLOR</p>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <div className="w-4 h-4 rounded-full bg-[#0284c7]" /> #0284c7 (Sky Blue)
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <p className="font-mono font-bold text-slate-400 text-[10px] uppercase">TYPOGRAPHY STANDARD</p>
                    <p className="font-bold text-slate-800">Inter SemiBold 16px</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <p className="font-mono font-bold text-slate-400 text-[10px] uppercase">PENPOT MCP GATEWAY</p>
                    <p className="font-bold text-emerald-600 flex items-center gap-1">🟢 Ready for Commit Sync</p>
                  </div>
                </div>

                {/* Instruction Box */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-purple-950">
                    <Edit3 className="w-4 h-4 text-purple-600" /> Hướng dẫn thao tác trực tiếp Penpot Canvas (Human Edit Mode):
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed font-medium">
                    <li>Nhấn nút <strong>"Mở trong Penpot Tab Mới"</strong> góc trên bên phải để làm việc trên canvas chuẩn của Penpot.</li>
                    <li>Mọi chỉnh sửa về vector, đổi màu, sửa text trên Penpot sẽ tự động đồng bộ về Agent.</li>
                    <li>Nhấn <strong>"Chuyển Sang Chat Với Designer Agent"</strong> bên dưới nếu muốn ra lệnh cho AI Agent tự chỉnh sửa bằng Prompt.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
              <span className="font-mono text-slate-400">Penpot File ID: penpot-art-1201-invoice-uploader</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPenpotModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
                >
                  Đóng Penpot View
                </button>
                <button
                  onClick={() => setShowPenpotModal(false)}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  🤖 Chuyển Sang Chat Với Designer Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceView;
