import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Sparkles, Code, Bug, Lightbulb, Cpu, AlertTriangle, GitBranch, Presentation, HelpCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHAT_CATEGORIES } from '../services/chat';

/**
 * AI Mentor Chatbot Component with 7 Specialized Capabilities
 */
const AIChat = ({
  chatHistory = [],
  onSendMessage,
  onClearChat,
  loading = false
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || loading) return;
    onSendMessage(inputMsg, selectedCategory);
    setInputMsg('');
  };

  const handleQuickPrompt = (prompt, catId) => {
    setSelectedCategory(catId);
    onSendMessage(prompt, catId);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Bug': return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      case 'Lightbulb': return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
      case 'GitBranch': return <GitBranch className="w-3.5 h-3.5 text-purple-400" />;
      case 'Presentation': return <Presentation className="w-3.5 h-3.5 text-emerald-400" />;
      case 'HelpCircle': return <HelpCircle className="w-3.5 h-3.5 text-blue-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#050816]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0B1120]/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              ZAYATHON AI Mentor Assistant
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                24/7 Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Debug code, refine architecture, suggest tech stack & polish presentation decks
            </p>
          </div>
        </div>

        {chatHistory.length > 0 && (
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Capabilities Quick Pills */}
      <div className="px-4 py-3 bg-[#0B1120]/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {CHAT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {getIcon(cat.icon)}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar bg-gradient-to-b from-[#050816]/50 to-[#0B1120]/50">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
            <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How can I assist your hackathon project today?</h3>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">
                Select a prompt capability below or type your custom query to receive instant AI mentor guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg pt-2 text-left font-mono text-xs">
              <button
                onClick={() => handleQuickPrompt('Debug my React state component error', 'debug')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Bug className="w-4 h-4 text-rose-400 shrink-0" />
                <span>"Debug my React state error"</span>
              </button>

              <button
                onClick={() => handleQuickPrompt('Generate a microservice architecture diagram', 'architecture')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <GitBranch className="w-4 h-4 text-purple-400 shrink-0" />
                <span>"Generate Arch Diagram"</span>
              </button>

              <button
                onClick={() => handleQuickPrompt('Suggest a cyber tech stack for an AI hackathon', 'techstack')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>"Suggest Tech Stack"</span>
              </button>

              <button
                onClick={() => handleQuickPrompt('How do I structure my pitch deck slides?', 'presentation')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Presentation className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>"Pitch Deck Presentation"</span>
              </button>
            </div>
          </div>
        ) : (
          chatHistory.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.sender === 'ai' && (
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs font-mono leading-relaxed shadow-lg ${
                  item.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                    : 'bg-[#0B1120] border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {item.message}

                {/* Architecture Visual Diagram Preview if available */}
                {item.diagram && (
                  <div className="mt-3 p-3 rounded-xl bg-[#050816] border border-cyan-500/30 text-cyan-400 font-mono text-[11px] overflow-x-auto">
                    <div className="text-[10px] text-slate-500 mb-1 font-bold tracking-wider uppercase">
                      Visual Architecture Flowchart:
                    </div>
                    <pre className="text-cyan-300 leading-tight">{item.diagram}</pre>
                  </div>
                )}
              </div>

              {item.sender === 'user' && (
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-3 text-cyan-400 text-xs font-mono">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>AI Mentor is thinking & synthesizing response...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#0B1120]/90 flex items-center gap-3">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask AI mentor to debug code, suggest tech stack, or explain errors..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || loading}
          className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIChat;
