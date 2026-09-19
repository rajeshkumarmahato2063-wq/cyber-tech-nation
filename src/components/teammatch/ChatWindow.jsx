import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Smile, Image as ImageIcon, CheckCheck, Shield, Users } from 'lucide-react';
import chatService from '../../services/chat';

const EMOJIS = ['🚀', '🔥', '💡', '💻', '🤖', '⚡', '🎉', '👍', '❤️', '🎯'];

const ChatWindow = ({ isOpen, onClose, team, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !team) return;

    // Load initial messages
    const loadMessages = async () => {
      const history = await chatService.getTeamMessages(team.id);
      setMessages(history);
    };
    loadMessages();

    // Subscribe to real-time chat messages
    const channel = chatService.subscribeToTeamChat(team.id, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });

    return () => {
      if (channel && channel.unsubscribe) channel.unsubscribe();
    };
  }, [isOpen, team]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !team) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    let fileUrl = null;
    if (selectedFile) {
      setUploadingFile(true);
      try {
        fileUrl = await chatService.uploadAttachment(selectedFile);
      } catch (err) {
        console.error('Attachment upload failed:', err);
      } finally {
        setUploadingFile(false);
        setSelectedFile(null);
      }
    }

    const senderId = currentUser?.id || 'u1';
    const senderName = currentUser?.profile?.full_name || currentUser?.email?.split('@')[0] || 'Team Member';
    const senderPhoto = currentUser?.profile?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';

    const sent = await chatService.sendMessage(
      team.id,
      senderId,
      senderName,
      senderPhoto,
      inputMessage,
      fileUrl
    );

    setMessages(prev => [...prev, sent]);
    setInputMessage('');
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    chatService.broadcastTyping(team.id, currentUser?.profile?.full_name || 'Teammate', true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card rounded-2xl border border-white/10 w-full max-w-2xl h-[85vh] flex flex-col relative overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-title font-bold text-base text-white flex items-center gap-2">
                  <span>{team.team_name}</span>
                  <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Chat
                  </span>
                </h3>
                <p className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>Domain: {team.domain}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-mono space-y-2">
                <p>🚀 Welcome to your private team chat room!</p>
                <p className="text-[11px] text-slate-500">
                  Introduce yourself, share GitHub repos, and plan your hackathon submission.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === (currentUser?.id || 'u1');
                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={msg.sender_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={msg.sender_name}
                      className="w-7 h-7 rounded-full object-cover border border-cyan-500/30 shrink-0 mt-1"
                    />

                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                      <div className="flex items-center gap-2 px-1 text-[10px] font-mono text-slate-400">
                        <span>{msg.sender_name || 'Teammate'}</span>
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl leading-relaxed text-xs ${
                          isMe
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none'
                            : 'bg-white/10 text-slate-200 border border-white/10 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                        {msg.file_url && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-200 underline font-mono flex items-center gap-1 text-[11px]"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>View Attachment</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end px-1 text-[10px] text-cyan-400 font-mono">
                        <CheckCheck className="w-3 h-3 text-cyan-400" />
                        <span>Read</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Tray Popup */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mx-5 mb-2 p-2 bg-[#0B1120] border border-white/10 rounded-xl flex items-center gap-2 overflow-x-auto"
              >
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setInputMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-base cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Selected Badge */}
          {selectedFile && (
            <div className="mx-5 mb-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="truncate">Attached: {selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)} className="text-rose-400 font-bold ml-2">×</button>
            </div>
          )}

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-2">
            <label className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              className="cyber-input py-2.5 px-3 text-xs flex-1 font-sans"
            />

            <button
              type="submit"
              disabled={uploadingFile}
              className="neon-button p-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatWindow;
