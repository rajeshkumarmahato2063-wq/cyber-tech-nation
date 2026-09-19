import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, UserPlus, Send, Check, ShieldCheck, Sparkles, Hash } from 'lucide-react';
import { networkingService } from '../../services/networking';

const NetworkingHubPage = ({ currentUser, targetUserId = null }) => {
  const [connections, setConnections] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'groups' | 'connections'
  const [loading, setLoading] = useState(true);

  const groups = [
    { name: '#agentic-ai-hackers', members: '142 Hackers', desc: 'Discuss LLM prompts, LangChain, and autonomous agents.' },
    { name: '#fullstack-web-sprint', members: '210 Hackers', desc: 'React 19, Supabase, Tailwind, and serverless backends.' },
    { name: '#cyber-web3-security', members: '98 Hackers', desc: 'Zero Knowledge proofs, penetration testing, and smart contracts.' }
  ];

  useEffect(() => {
    loadConnections();
  }, [currentUser]);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const list = await networkingService.getUserConnections(currentUser?.id);
      setConnections(list);
      if (list.length > 0) {
        const partner = list.find(c => c.partner_id === targetUserId) || list[0];
        setActivePartner(partner);
        loadChatMessages(partner.partner_id);
      }
    } catch (err) {
      console.warn('Networking load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (partnerId) => {
    if (!currentUser?.id || !partnerId) return;
    try {
      const history = await networkingService.getMessages(currentUser.id, partnerId);
      setMessages(history);
    } catch (err) {
      console.warn('Messages load error:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;
    try {
      const sent = await networkingService.sendMessage(currentUser?.id || 'usr-1', activePartner.partner_id, newMessage);
      setMessages(prev => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      alert(`Send error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8 font-sans text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Users className="w-4 h-4" /> Realtime Developer Networking Hub
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight">
            Connect & Collaborate
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Network with fellow hackers, join specialized discussion channels, follow mentors, and exchange real-time instant messages.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#0B1120] p-1.5 rounded-2xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Direct Chat
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
              activeTab === 'groups' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" /> Hacker Groups
          </button>
        </div>
      </div>

      {/* Main Networking Area */}
      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Connection List Sidebar */}
          <div className="p-4 rounded-3xl bg-[#0B1120] border border-white/10 flex flex-col space-y-3 font-mono text-xs overflow-y-auto">
            <span className="text-slate-400 font-bold uppercase tracking-wider block px-2">YOUR NETWORK CONNECTIONS</span>
            {connections.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No active connections yet. Explore candidate profiles to connect.</div>
            ) : (
              connections.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => {
                    setActivePartner(conn);
                    loadChatMessages(conn.partner_id);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center gap-3 ${
                    activePartner?.partner_id === conn.partner_id
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <img src={conn.avatar} alt={conn.partner_name} className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-white block truncate">{conn.partner_name}</span>
                    <span className="text-slate-400 text-[10px] block truncate">{conn.partner_role}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#0B1120] border border-cyan-500/30 flex flex-col justify-between space-y-4">
            {activePartner ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/10 font-mono text-xs">
                  <img src={activePartner.avatar} alt={activePartner.partner_name} className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{activePartner.partner_name}</h3>
                    <p className="text-cyan-400 text-[11px]">{activePartner.partner_role}</p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
                  {messages.map((m) => {
                    const isMe = m.sender_id === (currentUser?.id || 'usr-1');
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl ${
                          isMe
                            ? 'bg-cyan-500 text-black font-semibold rounded-br-none shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                            : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                        }`}>
                          <p className="leading-relaxed">{m.content}</p>
                          <span className="text-[9px] opacity-75 block text-right mt-1">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-xs">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type direct message..."
                    className="flex-1 bg-[#050816] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="neon-button px-5 py-3 rounded-2xl text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400 font-mono text-xs">
                Select a network connection from the sidebar to open instant chat.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Hacker Discussion Groups Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {groups.map((g) => (
            <div key={g.name} className="p-6 rounded-3xl bg-[#0B1120] border border-purple-500/30 space-y-3 text-left">
              <span className="text-purple-400 font-bold text-sm block">{g.name}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 inline-block font-bold">
                {g.members}
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">{g.desc}</p>
              <button
                onClick={() => alert(`Joined ${g.name} discussion group!`)}
                className="w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 font-bold transition-all cursor-pointer"
              >
                Join Channel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkingHubPage;
