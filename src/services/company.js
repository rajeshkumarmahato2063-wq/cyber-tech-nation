import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const MOCK_COMPANIES = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'CyberShield AI',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    website: 'https://cybershield.ai',
    location: 'San Francisco, CA (Remote)',
    industry: 'Cybersecurity & AI',
    employee_count: '100-250 Employees',
    description: 'Pioneering autonomous threat intelligence and agentic security patch deployment for enterprise infrastructure.',
    verified: true,
    open_roles_count: 5
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Nexus Robotics',
    logo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200',
    website: 'https://nexusrobotics.io',
    location: 'Austin, TX (Remote)',
    industry: 'Autonomous Robotics & ML',
    employee_count: '500+ Employees',
    description: 'Building next-generation computer vision and edge neural processing units for industrial robotics.',
    verified: true,
    open_roles_count: 8
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Solana Labs Tech',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200',
    website: 'https://solanalabs.com',
    location: 'New York, NY (Remote)',
    industry: 'Web3 & Decentralized Systems',
    employee_count: '200+ Employees',
    description: 'Empowering high-throughput blockchain networks and zero-knowledge cryptographic protocol engineering.',
    verified: true,
    open_roles_count: 3
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'CloudScale Systems',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200',
    website: 'https://cloudscale.dev',
    location: 'Seattle, WA (Hybrid)',
    industry: 'Cloud Infrastructure & DevOps',
    employee_count: '1,000+ Employees',
    description: 'Architecting serverless data mesh architectures and real-time distributed database clustering.',
    verified: true,
    open_roles_count: 6
  }
];

/**
 * Fetch Companies List
 */
export const getCompanies = async () => {
  if (!isSupabaseConfigured()) return MOCK_COMPANIES;

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('verified', { ascending: false });

    if (error || !data || data.length === 0) return MOCK_COMPANIES;
    return data;
  } catch (err) {
    console.warn('[Company Service] Get companies error:', err.message);
    return MOCK_COMPANIES;
  }
};

/**
 * Fetch Company Details By ID
 */
export const getCompanyById = async (id) => {
  if (!isSupabaseConfigured() || !id) {
    return MOCK_COMPANIES.find(c => c.id === id) || MOCK_COMPANIES[0];
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*, jobs(*)')
      .eq('id', id)
      .single();

    if (error || !data) return MOCK_COMPANIES.find(c => c.id === id) || MOCK_COMPANIES[0];
    return data;
  } catch (err) {
    console.warn('[Company Service] Get company by id error:', err.message);
    return MOCK_COMPANIES.find(c => c.id === id) || MOCK_COMPANIES[0];
  }
};

/**
 * Create or Register Company Profile
 */
export const createCompanyProfile = async ({
  userId,
  name,
  logo,
  website,
  location,
  industry,
  employeeCount,
  description
}) => {
  const companyPayload = {
    id: `c-${Date.now()}`,
    user_id: userId,
    name,
    logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    website,
    location: location || 'San Francisco, CA',
    industry: industry || 'AI & Tech',
    employee_count: employeeCount || '10-50 Employees',
    description,
    verified: true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyPayload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('[Company Service] Create profile error:', err.message);
    }
  }

  return companyPayload;
};

/**
 * Post New Job Role for a Company
 */
export const createJobPosting = async ({
  companyId,
  companyName,
  companyLogo,
  title,
  type,
  location,
  stipendSalary,
  requiredSkills,
  experienceLevel,
  deadline,
  description
}) => {
  const jobPayload = {
    id: `j-${Date.now()}`,
    company_id: companyId,
    company_name: companyName,
    company_logo: companyLogo,
    title,
    type: type || 'Internship',
    location: location || 'Remote',
    stipend_salary: stipendSalary,
    required_skills: requiredSkills || [],
    experience_level: experienceLevel || 'Entry Level',
    deadline: deadline || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    description,
    status: 'active',
    applicants_count: 0,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobPayload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('[Company Service] Create job error:', err.message);
    }
  }

  return jobPayload;
};
