import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle } from 'lucide-react';

/**
 * Preset FAQ items for instant answers
 */
const QUICK_QUESTIONS = [
  { q: 'Is registration free?', a: 'Yes! ZAYATHON is 100% free for all hackers and developers.' },
  { q: 'What is the team size limit?', a: 'Teams can have up to 4 members (1 Team Leader + 3 Members), or you can participate solo.' },
  { q: 'What are the prize rewards?', a: 'First Prize: ₹3,000, Second: ₹2,000, Third: ₹1,000, plus internships, certificates & swag kits!' },
  { q: 'When is the hackathon?', a: 'ZAYATHON 48-hour sprint begins on Dec 01, 2026.' }
];

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Welcome to ZAYATHON! How can I assist your hackathon journey today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add User message
    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate AI Assistant response
    setTimeout(() => {
      let reply = "Thanks for asking! Check our Domains, Timeline, and FAQ sections for full event details, or register your team now!";
      const lower = query.toLowerCase();

      if (lower.includes('free') || lower.includes('cost') || lower.includes('fee')) {
        reply = 'ZAYATHON is 100% free for all participants!';
      } else if (lower.includes('team') || lower.includes('member') || lower.includes('size')) {
        reply = 'Teams can have up to 4 members total (1 leader + up to 3 members). Solo hackers are also welcome!';
      } else if (lower.includes('prize') || lower.includes('reward') || lower.includes('money')) {
        reply = 'Prize pool includes ₹3,000 (1st), ₹2,000 (2nd), ₹1,000 (3rd), plus internship offers and tech swag kits!';
      } else if (lower.includes('date') || lower.includes('when') || lower.includes('time')) {
        reply = 'Registration opens Oct 15, and the 48-hour hackathon starts Dec 01, 2026.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* Chat Drawer Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              mb-4 w-[calc(100vw-3rem)] sm:w-80 md:w-96 rounded-3xl
              bg-[#0B1120]/95 backdrop-blur-2xl
              border border-cyan-500/30
              shadow-[0_20px_50px_rgba(0,229,255,0.25)]
              overflow-hidden flex flex-col h-[480px]
            `}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    ZAYATHON AI Assistant <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-medium">Online • Instant Support</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[82%] p-3 rounded-2xl leading-relaxed
                      ${msg.sender === 'user'
                        ? 'bg-cyan-500 text-slate-950 font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                        : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'}
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick Questions Suggestions */}
              {messages.length < 5 && (
                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((item, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(item.q)}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-all hover:scale-105"
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-white/10 flex items-center gap-2 bg-white/[0.02]"
            >
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-slate-950 font-bold shadow-[0_0_30px_rgba(0,229,255,0.6)] flex items-center justify-center"
        aria-label="Toggle AI Support Chat"
      >
        <div className="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping pointer-events-none group-hover:hidden" />
        {isOpen ? (
          <X className="w-6 h-6 text-slate-950 z-10" />
        ) : (
          <MessageSquare className="w-6 h-6 text-slate-950 z-10" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingChatButton;
