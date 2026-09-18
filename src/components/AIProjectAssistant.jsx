import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { queryAIProjectAssistant, getAIChatHistory } from '../services/ai';

/**
 * AI Project Assistant Component for Hackathon Participants
 */
const AIProjectAssistant = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('Title');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const history = await getAIChatHistory(user.id);
    setChatLog(history);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setPrompt('');
    setLoading(true);

    try {
      const response = await queryAIProjectAssistant(userMsg, category, user?.id);
      setChatLog(prev => [{ prompt: userMsg, response, category, created_at: new Date().toISOString() }, ...prev]);
    } catch (err) {
      console.warn('AI query error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-[#050816] border border-cyan-500/40 space-y-4 font-mono text-xs shadow-[0_0_30px_rgba(0,229,255,0.15)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Project Copilot <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Refine problem abstracts, tech stacks & title suggestions</p>
          </div>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#0B1120] border border-white/12 rounded-xl px-2.5 py-1 text-white focus:outline-none focus:border-cyan-400 text-[11px]"
        >
          <option value="Title">Title Suggestions</option>
          <option value="Abstract">Abstract Refinement</option>
          <option value="TechStack">Tech Stack Advisor</option>
          <option value="FAQ">Judging FAQ</option>
        </select>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask AI for title ideas, abstract polishing, or tech stack suggestions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-[#050816] font-bold hover:bg-cyan-400 transition-all flex items-center gap-1 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* Chat Log Stream */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {chatLog.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-[11px] rounded-xl bg-white/5">
            Type a prompt above to generate AI project guidance.
          </div>
        ) : (
          chatLog.map((chat, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="font-bold text-cyan-300 flex items-center justify-between">
                <span>Q: {chat.prompt}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-slate-400">{chat.category}</span>
              </div>
              <div className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-line bg-black/40 p-2.5 rounded-lg border border-white/5">
                {chat.response}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIProjectAssistant;
