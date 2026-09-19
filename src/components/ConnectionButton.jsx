import React, { useState } from 'react';
import { UserPlus, Check, MessageSquare, Clock } from 'lucide-react';
import { networkingService } from '../services/networking';

const ConnectionButton = ({ currentUserId, targetUserId, onOpenChat, initialStatus = 'none' }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!currentUserId) {
      alert('Please sign in to connect with participants.');
      return;
    }
    setLoading(true);
    try {
      await networkingService.sendConnectionRequest(currentUserId, targetUserId);
      setStatus('pending');
    } catch (err) {
      console.warn('Connection error:', err);
      setStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      {status === 'accepted' ? (
        <button
          disabled
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" /> Connected
        </button>
      ) : status === 'pending' ? (
        <button
          disabled
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" /> Request Pending
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.2)]"
        >
          <UserPlus className="w-3.5 h-3.5" /> {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}

      {onOpenChat && (
        <button
          onClick={() => onOpenChat(targetUserId)}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Chat
        </button>
      )}
    </div>
  );
};

export default ConnectionButton;
