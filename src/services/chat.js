import { supabase, isSupabaseConfigured } from '../lib/supabase';

let MOCK_MESSAGES = {
  't1': [
    {
      id: 'm1',
      chat_id: 't1',
      sender_id: 'u2',
      sender_name: 'Priya Patel',
      sender_photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      message: 'Hey team! Welcome to CyberDefenders Alpha chat. Let us decide our stack details.',
      file_url: null,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'm2',
      chat_id: 't1',
      sender_id: 'u1',
      sender_name: 'Aarav Sharma',
      sender_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      message: 'Sounds awesome! I can handle the React frontend & Supabase database integration.',
      file_url: null,
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};

export const chatService = {
  // Get chat messages for a team
  async getTeamMessages(teamId) {
    if (!teamId) return [];

    if (!isSupabaseConfigured()) {
      return MOCK_MESSAGES[teamId] || [];
    }

    try {
      // Get chat_id from team_id
      const { data: chatData, error: chatErr } = await supabase
        .from('team_chats')
        .select('id')
        .eq('team_id', teamId)
        .single();

      if (chatErr && chatErr.code === 'PGRST116') {
        // Create team chat if absent
        const { data: newChat, error: createErr } = await supabase
          .from('team_chats')
          .insert({ team_id: teamId })
          .select('id')
          .single();
        if (createErr) throw createErr;
        return [];
      }

      if (chatErr) throw chatErr;

      const { data: messages, error: msgErr } = await supabase
        .from('team_messages')
        .select('*')
        .eq('chat_id', chatData.id)
        .order('created_at', { ascending: true });

      if (msgErr) throw msgErr;
      return messages || [];
    } catch (err) {
      console.warn('Chat query fallback:', err.message);
      return MOCK_MESSAGES[teamId] || [];
    }
  },

  // Send message with text/file attachment
  async sendMessage(teamId, senderId, senderName, senderPhoto, messageText, fileUrl = null) {
    const newMsg = {
      id: `msg_${Date.now()}`,
      chat_id: teamId,
      sender_id: senderId,
      sender_name: senderName,
      sender_photo: senderPhoto,
      message: messageText,
      file_url: fileUrl,
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured()) {
      if (!MOCK_MESSAGES[teamId]) MOCK_MESSAGES[teamId] = [];
      MOCK_MESSAGES[teamId].push(newMsg);
      return newMsg;
    }

    try {
      // Find chat ID
      let { data: chatData } = await supabase
        .from('team_chats')
        .select('id')
        .eq('team_id', teamId)
        .single();

      if (!chatData) {
        const { data: newChat } = await supabase
          .from('team_chats')
          .insert({ team_id: teamId })
          .select('id')
          .single();
        chatData = newChat;
      }

      const { data, error } = await supabase
        .from('team_messages')
        .insert({
          chat_id: chatData.id,
          sender_id: senderId,
          message: messageText,
          file_url: fileUrl
        })
        .select()
        .single();

      if (error) throw error;
      return { ...data, sender_name: senderName, sender_photo: senderPhoto };
    } catch (err) {
      console.warn('Send message fallback:', err.message);
      if (!MOCK_MESSAGES[teamId]) MOCK_MESSAGES[teamId] = [];
      MOCK_MESSAGES[teamId].push(newMsg);
      return newMsg;
    }
  },

  // Real-time Chat Subscription
  subscribeToTeamChat(teamId, onMessageReceived) {
    if (!isSupabaseConfigured() || !teamId) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel(`team_chat_${teamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages'
      }, (payload) => {
        onMessageReceived(payload.new);
      })
      .subscribe();

    return channel;
  },

  // Real-time Typing Indicator Broadcast
  broadcastTyping(teamId, userName, isTyping) {
    if (!isSupabaseConfigured() || !teamId) return;
    const channel = supabase.channel(`typing_${teamId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userName, isTyping }
    });
  },

  // Upload file attachment to storage
  async uploadAttachment(file) {
    if (!isSupabaseConfigured()) {
      return URL.createObjectURL(file);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `chat_files/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team_match_assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('team_match_assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};

export default chatService;
