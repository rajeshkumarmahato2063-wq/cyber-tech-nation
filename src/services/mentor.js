import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Mock mentors dataset for local offline fallback
export const MOCK_MENTORS = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Dr. Alex Mercer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    company: 'OpenAI',
    role_title: 'Principal AI Architect',
    expertise: ['AI/ML', 'LLMs', 'PyTorch', 'Agentic AI'],
    experience: '10+ Years',
    linkedin: 'https://linkedin.com/in/alex-mercer',
    availability: 'Available Today',
    rating: 4.95,
    reviews_count: 42,
    bio: 'Ex-Google Brain researcher specializing in Agentic workflows and multi-modal transformers. Loves helping hackathon teams optimize inference latency.'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Elena Rostova',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    company: 'ConsenSys',
    role_title: 'Lead Web3 Security Engineer',
    expertise: ['Web3', 'Blockchain', 'Solidity', 'Smart Contracts'],
    experience: '8+ Years',
    linkedin: 'https://linkedin.com/in/elena-rostova',
    availability: 'Available Tomorrow',
    rating: 4.90,
    reviews_count: 38,
    bio: 'Smart contract auditor and ZK-proof enthusiast. Has audited over $500M in TVL protocols across Ethereum and Solana.'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Sophia Lin',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    company: 'Amazon Web Services',
    role_title: 'Principal Cloud Architect',
    expertise: ['Full Stack', 'Cloud', 'AWS', 'Kubernetes', 'Supabase'],
    experience: '12+ Years',
    linkedin: 'https://linkedin.com/in/sophia-lin',
    availability: 'Available Today',
    rating: 4.98,
    reviews_count: 64,
    bio: 'Specialist in serverless microservices, distributed systems, and real-time backend architecture. Veteran hackathon judge.'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    name: 'Marcus Vance',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    company: 'Figma',
    role_title: 'VP of Product Design',
    expertise: ['UX/UI', 'Product Strategy', 'Design Systems', 'Figma'],
    experience: '9+ Years',
    linkedin: 'https://linkedin.com/in/marcus-vance',
    availability: 'Available Friday',
    rating: 4.88,
    reviews_count: 29,
    bio: 'Passionate about turning complex developer products into intuitive, beautiful user experiences. Keynote speaker on UI aesthetics.'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    name: 'David Thorne',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    company: 'CrowdStrike',
    role_title: 'Staff Cybersecurity Researcher',
    expertise: ['Cybersecurity', 'Zero Trust', 'Penetration Testing', 'Python'],
    experience: '11+ Years',
    linkedin: 'https://linkedin.com/in/david-thorne',
    availability: 'Available Today',
    rating: 4.92,
    reviews_count: 51,
    bio: 'Cybersecurity researcher focusing on autonomous red-teaming tools, vulnerability analysis, and zero-trust mesh topologies.'
  }
];

/**
 * Fetch list of mentors with filter options
 */
export const getMentors = async (category = 'All') => {
  if (!isSupabaseConfigured()) {
    if (category === 'All') return MOCK_MENTORS;
    return MOCK_MENTORS.filter(m => m.expertise.some(e => e.toLowerCase().includes(category.toLowerCase())));
  }

  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      if (category === 'All') return MOCK_MENTORS;
      return MOCK_MENTORS.filter(m => m.expertise.some(e => e.toLowerCase().includes(category.toLowerCase())));
    }

    if (category === 'All') return data;
    return data.filter(m => Array.isArray(m.expertise) && m.expertise.some(e => e.toLowerCase().includes(category.toLowerCase())));
  } catch (err) {
    console.warn('[Mentor Service] Fetch error:', err.message);
    return MOCK_MENTORS;
  }
};

/**
 * Fetch mentor by ID
 */
export const getMentorById = async (id) => {
  if (!isSupabaseConfigured() || !id) {
    return MOCK_MENTORS.find(m => m.id === id) || MOCK_MENTORS[0];
  }

  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return MOCK_MENTORS.find(m => m.id === id) || MOCK_MENTORS[0];
    }
    return data;
  } catch (err) {
    console.warn('[Mentor Service] Get mentor error:', err.message);
    return MOCK_MENTORS.find(m => m.id === id) || MOCK_MENTORS[0];
  }
};

/**
 * Fetch mentor hub statistics summary
 */
export const getMentorHubStats = async () => {
  return {
    totalMentors: 50,
    sessionsBooked: 1240,
    avgRating: 4.93,
    successRate: '98%'
  };
};
