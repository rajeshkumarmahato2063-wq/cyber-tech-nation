import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const networkingService = {
  /**
   * Send connection request to another participant
   */
  async sendConnectionRequest(requesterId, receiverId) {
    if (!isSupabaseConfigured() || !requesterId) {
      return { id: `mock-conn-${Date.now()}`, status: 'pending' };
    }

    const { data, error } = await supabase
      .from('connections')
      .upsert({ requester_id: requesterId, receiver_id: receiverId, status: 'pending' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get user connection list & incoming requests
   */
  async getUserConnections(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return [
        {
          id: 'conn-1',
          partner_name: 'John Doe',
          partner_role: 'Full-Stack Developer',
          status: 'accepted',
          partner_id: 'usr-2',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'conn-2',
          partner_name: 'Sarah Chen',
          partner_role: 'AI Researcher',
          status: 'pending',
          partner_id: 'usr-3',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Send instant chat message
   */
  async sendMessage(senderId, receiverId, content) {
    if (!isSupabaseConfigured() || !senderId) {
      return {
        id: `msg-${Date.now()}`,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        created_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get conversation history between two users
   */
  async getMessages(userA, userB) {
    const mockMessages = [
      { id: 'm1', sender_id: userB, receiver_id: userA, content: 'Hey! Loved your ZayaThon AI submission!', created_at: new Date(Date.now() - 3600 * 1000).toISOString() },
      { id: 'm2', sender_id: userA, receiver_id: userB, content: 'Thanks! Let’s collaborate on the upcoming AI Sprint hackathon.', created_at: new Date(Date.now() - 1800 * 1000).toISOString() }
    ];

    if (!isSupabaseConfigured() || !userA || !userB) {
      return mockMessages;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userA},receiver_id.eq.${userB}),and(sender_id.eq.${userB},receiver_id.eq.${userA})`)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) return mockMessages;
      return data;
    } catch {
      return mockMessages;
    }
  },

  /**
   * Realtime message listener
   */
  subscribeToMessages(userId, callback) {
    if (!isSupabaseConfigured() || !userId) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`chat-user-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    return {
      unsubscribe: () => supabase.removeChannel(channel)
    };
  }
};
