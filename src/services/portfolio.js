import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Fallback Mock Participant Portfolios for offline/demo mode
export const FALLBACK_PORTFOLIOS = [
  {
    id: 'port-1',
    user_id: 'usr-1',
    username: 'rajesh-mahato',
    full_name: 'Rajesh Kumar Mahato',
    headline: 'Lead AI Engineer & Full-Stack Architect',
    bio: 'Passionate developer building autonomous AI agents, scalable cloud architectures, and real-time cyber tools. Winner of 3 national hackathons.',
    college: 'Institute of Engineering & Technology',
    department: 'Computer Science & AI',
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    github_url: 'https://github.com/rajeshkumarmahato2063-wq',
    linkedin_url: 'https://linkedin.com/in/rajeshkumarmahato',
    resume_url: '#',
    skills: ['React', 'Node.js', 'Python', 'Agentic AI', 'Supabase', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
    custom_theme: 'cyber',
    is_public: true,
    community_points: 1250,
    badges: [
      { code: 'winner', title: 'Flagship Winner', icon: 'Trophy', color: 'yellow', description: 'Secured 1st Place in ZayaThon 2026.' },
      { code: 'ai_builder', title: 'AI Builder', icon: 'Cpu', color: 'cyan', description: 'Built autonomous AI agentic workflows.' },
      { code: 'team_leader', title: 'Team Leader', icon: 'Users', color: 'blue', description: 'Led squad Quantum Guard to victory.' }
    ],
    projects: [
      {
        title: 'ZayaThon Multi-Event SaaS Platform',
        domain: 'Agentic AI & Full Stack',
        description: 'End-to-end multi-event hackathon management SaaS with live ops broadcast and AI assistant.',
        link: 'https://github.com/rajeshkumarmahato2063-wq/cyber-tech-nation'
      },
      {
        title: 'Decentralized ZK Threat Guard',
        domain: 'Cyber Security & Web3',
        description: 'Zero Knowledge proof system for automated intrusion detection and decentralized firewalling.',
        link: '#'
      }
    ],
    certificates: [
      {
        certificate_number: 'ZAYA-2026-WINNER-01',
        award_type: 'Winner (1st Place)',
        issue_date: '2026-09-18',
        domain: 'Agentic AI'
      }
    ]
  },
  {
    id: 'port-2',
    user_id: 'usr-2',
    username: 'john-doe',
    full_name: 'John Doe',
    headline: 'Full-Stack Developer & Web3 Researcher',
    bio: 'Building decentralized financial infrastructure and privacy protocols. Cyber enthusiast and open-source contributor.',
    college: 'Tech University Arena',
    department: 'Software Engineering',
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    github_url: 'https://github.com/johndoe',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    resume_url: '#',
    skills: ['Solidity', 'Web3.js', 'React', 'Rust', 'Docker', 'GraphQL'],
    custom_theme: 'emerald',
    is_public: true,
    community_points: 840,
    badges: [
      { code: 'web_wizard', title: 'Web Wizard', icon: 'Code', color: 'emerald', description: 'Designed high-performance UI components.' },
      { code: 'early_bird', title: 'Early Bird', icon: 'Zap', color: 'amber', description: 'First 100 participants to register.' }
    ],
    projects: [
      {
        title: 'DeFi Vault Protocol',
        domain: 'FinTech & Blockchain',
        description: 'Automated yield aggregator built with smart contract security assertions.',
        link: '#'
      }
    ],
    certificates: [
      {
        certificate_number: 'ZAYA-2025-PARTICIPANT-88',
        award_type: 'Participant',
        issue_date: '2025-11-20',
        domain: 'FinTech & Blockchain'
      }
    ]
  }
];

export const portfolioService = {
  /**
   * Get portfolio by username (slug)
   */
  async getPortfolioByUsername(username) {
    if (!isSupabaseConfigured()) {
      const found = FALLBACK_PORTFOLIOS.find(p => p.username === username);
      return found || FALLBACK_PORTFOLIOS[0];
    }

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*, profiles(*)')
        .eq('username', username)
        .maybeSingle();

      if (error || !data) {
        return FALLBACK_PORTFOLIOS.find(p => p.username === username) || FALLBACK_PORTFOLIOS[0];
      }

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*, badges(*)')
        .eq('user_id', data.user_id);

      const badgesList = achievements ? achievements.map(a => a.badges) : [];

      return {
        ...data,
        full_name: data.profiles?.full_name || data.username,
        badges: badgesList.length > 0 ? badgesList : FALLBACK_PORTFOLIOS[0].badges,
        projects: FALLBACK_PORTFOLIOS[0].projects,
        certificates: FALLBACK_PORTFOLIOS[0].certificates
      };
    } catch (err) {
      console.warn('Portfolio fetch fallback:', err);
      return FALLBACK_PORTFOLIOS.find(p => p.username === username) || FALLBACK_PORTFOLIOS[0];
    }
  },

  /**
   * Get portfolio by user_id
   */
  async getUserPortfolio(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return FALLBACK_PORTFOLIOS[0];
    }

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*, profiles(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return FALLBACK_PORTFOLIOS[0];
      return data;
    } catch {
      return FALLBACK_PORTFOLIOS[0];
    }
  },

  /**
   * Update portfolio
   */
  async updatePortfolio(userId, updates) {
    if (!isSupabaseConfigured()) {
      return { ...FALLBACK_PORTFOLIOS[0], ...updates };
    }

    const { data, error } = await supabase
      .from('portfolios')
      .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * AI Skill Recommendations Engine
   */
  getAISkillRecommendations(currentSkills = []) {
    const defaultSkills = ['React', 'Node.js', 'Python'];
    const active = currentSkills.length > 0 ? currentSkills : defaultSkills;

    const missingSkills = [];
    if (!active.includes('TypeScript')) missingSkills.push({ name: 'TypeScript', reason: 'High demand in full-stack AI applications.' });
    if (!active.includes('Docker')) missingSkills.push({ name: 'Docker & Kubernetes', reason: 'Essential for containerizing microservices.' });
    if (!active.includes('GraphQL') && !active.includes('gRPC')) missingSkills.push({ name: 'GraphQL / API Design', reason: 'Optimizes high-throughput data fetching.' });
    if (!active.includes('PyTorch')) missingSkills.push({ name: 'PyTorch / Hugging Face', reason: 'Crucial for fine-tuning LLMs and Agentic AI.' });

    const learningResources = [
      { title: 'LangChain & LlamaIndex Mastery', link: 'https://python.langchain.com', type: 'Documentation' },
      { title: 'Full Stack TypeScript & Next.js Architecture', link: 'https://nextjs.org/docs', type: 'Course' },
      { title: 'Production Docker & Kubernetes for Developers', link: 'https://docs.docker.com', type: 'Guide' }
    ];

    const nextHackathons = [
      { name: 'AI Sprint 2027', theme: 'Generative AI & LLM Agentic Workflows', date: 'In 30 Days' },
      { name: 'Global Cyber Shield HackFest', theme: 'Zero Trust & Cloud Security', date: 'In 60 Days' }
    ];

    const careerPaths = [
      { title: 'Lead AI Engineer', match: '94%', keySkill: 'Agentic Workflows & Python' },
      { title: 'Full-Stack Systems Architect', match: '88%', keySkill: 'React, Node.js & Supabase' },
      { title: 'DevSecOps Specialist', match: '82%', keySkill: 'CI/CD & Kubernetes Security' }
    ];

    return {
      missingSkills,
      learningResources,
      nextHackathons,
      careerPaths
    };
  }
};
