import {
  BookOpen, Search, Bookmark, ArrowUpDown, Send, Bot, FileText, Code2,
  GitBranch, Palette, Layers, Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface WikiArticle {
  id: string;
  category: 'Business Rules' | 'Design System' | 'API Specs' | 'Code Snippets' | 'BPMN Workflows';
  title: string;
  description: string;
  tags: string[];
  author: string;
  reuses: number;
  timeAgo: string;
  iconBg: string;
}

const WIKI_ARTICLES: WikiArticle[] = [
  {
    id: 'WIKI-101',
    category: 'API Specs',
    title: 'Doc to JSON Schema Specification',
    description: 'Standardized document parsing schema definitions and validation constraints for incoming payload objects.',
    tags: ['#JSON Schema', '#Parsing', '#TSK-550'],
    author: 'BA Agent',
    reuses: 24,
    timeAgo: '2 hours ago',
    iconBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  {
    id: 'WIKI-102',
    category: 'Business Rules',
    title: '10MB Max Upload & File Validation Rule',
    description: 'Enforces maximum file size limit (10MB) for PDF, DOCX, and XLSX input uploads before agent processing.',
    tags: ['#BR-09', '#Validation', '#File Size'],
    author: 'BA Agent',
    reuses: 42,
    timeAgo: '1 day ago',
    iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  {
    id: 'WIKI-103',
    category: 'Design System',
    title: 'Penpot Color Tokens & Accessibility Standards',
    description: 'Design system color palette definitions, AA accessibility contrast guidelines (>4.5:1 ratio), and 44px touch targets.',
    tags: ['#Design System', '#Penpot', '#Accessibility'],
    author: 'Designer Agent',
    reuses: 38,
    timeAgo: '2 days ago',
    iconBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
  {
    id: 'WIKI-104',
    category: 'BPMN Workflows',
    title: 'Invoice Processing BPMN Workflow Touchpoints',
    description: 'End-to-end business process model mapping from document dropzone to OCR parsing and human review gate.',
    tags: ['#BPMN', '#Workflow', '#Invoice'],
    author: 'BA Agent',
    reuses: 19,
    timeAgo: '3 days ago',
    iconBg: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  },
];

interface ChatMsg { id: string; sender: 'user' | 'agent'; text: string; }

export const KnowledgeGraphView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [chatPrompt, setChatPrompt] = useState('');

  const [wikiMessages, setWikiMessages] = useState<ChatMsg[]>([
    {
      id: 'wm1',
      sender: 'agent',
      text: 'Hi! Ask me anything about business rules, API schemas, or design tokens in our Wiki.'
    },
    {
      id: 'wm2',
      sender: 'user',
      text: 'What is the max file size for invoice uploads?'
    },
    {
      id: 'wm3',
      sender: 'agent',
      text: 'According to WIKI-102 (BR-09), the maximum allowed upload size is 10MB for PDF/DOCX files.'
    }
  ]);

  const handleSendWikiMessage = () => {
    if (!chatPrompt.trim()) return;
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, sender: 'user', text: chatPrompt };
    setWikiMessages(prev => [...prev, userMsg]);
    const promptText = chatPrompt;
    setChatPrompt('');

    setTimeout(() => {
      let response = `According to our Wiki documents, "${promptText}" relates to standard platform guidelines.`;
      if (promptText.toLowerCase().includes('schema') || promptText.toLowerCase().includes('json')) {
        response = 'According to WIKI-101 (Doc to JSON Schema), definitions enforce strict validation constraints for incoming payloads.';
      } else if (promptText.toLowerCase().includes('color') || promptText.toLowerCase().includes('design')) {
        response = 'According to WIKI-103 (Design System), primary token is #0284c7 (Sky 600) with AA accessibility standards.';
      }
      const agentMsg: ChatMsg = { id: `a-${Date.now()}`, sender: 'agent', text: response };
      setWikiMessages(prev => [...prev, agentMsg]);
    }, 700);
  };

  const filteredArticles = WIKI_ARTICLES.filter(art => {
    const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || art.title.toLowerCase().includes(q) || art.description.toLowerCase().includes(q) || art.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full">
      {/* ─── HEADER ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-500" /> Platform Wiki & Knowledge Hub
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search, filter, and discover business rules, reusable code snippets, and design patterns.
        </p>
      </div>

      {/* ─── SEARCH & FILTER CHIPS BAR (Screenshot 1) ────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search wiki articles, business rules, or tags (e.g. BR-09, PDF, JSON Schema)..."
            className="w-full pl-12 pr-4 py-3 bg-muted/60 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all font-medium placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Chips & Sort */}
        <div className="flex justify-between items-center flex-wrap gap-3 pt-1 border-t border-border/60">
          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            {['All', 'Business Rules', 'Design System', 'API Specs', 'Code Snippets', 'BPMN Workflows'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT:</span>
            <select className="bg-muted border border-border rounded-lg px-2.5 py-1 text-foreground focus:outline-none cursor-pointer">
              <option>Relevance</option>
              <option>Most Recent</option>
              <option>Most Reused</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── SPLIT COLUMN LAYOUT: WIKI ARTICLES / WIKI ASSISTANT ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Column: Wiki Articles List (Screenshot 1) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredArticles.map(art => (
            <div key={art.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
              
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${art.iconBg}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sky-500 text-xs">{art.id}</span>
                      <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
                        {art.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground mt-0.5 leading-snug">{art.title}</h3>
                  </div>
                </div>

                <button className="text-muted-foreground hover:text-sky-500 transition-colors p-1 cursor-pointer" title="Bookmark">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {art.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {art.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-mono bg-muted/80 text-foreground px-2 py-0.5 rounded-md font-semibold border border-border/60">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                <span>By <strong className="text-foreground">{art.author}</strong></span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{art.reuses} reuses</span>
                  <span>{art.timeAgo}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Wiki Assistant Chat Widget (Screenshot 1) */}
        <div className="bg-card border border-border rounded-2xl flex flex-col min-h-[480px] shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                Wiki Assistant <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h3>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wikiMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white rounded-br-sm font-medium'
                    : 'bg-muted text-foreground rounded-bl-sm border border-border'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={chatPrompt}
              onChange={e => setChatPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendWikiMessage()}
              placeholder="Ask Wiki Assistant..."
              className="flex-1 px-4 py-2.5 bg-muted/60 border border-border rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
            <button
              onClick={handleSendWikiMessage}
              className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default KnowledgeGraphView;
