import { jsPDF } from 'jspdf';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const RESUME_TEMPLATES = [
  {
    id: 'modern_cyber',
    name: 'Modern Cyber ATS',
    description: 'Sleek dark-accented layout designed for AI, Web3, and Software Engineers.'
  },
  {
    id: 'professional_tech',
    name: 'Professional Tech',
    description: 'Clean two-column layout highlighting technical skills, projects, and work history.'
  },
  {
    id: 'minimalist_executive',
    name: 'Minimalist Executive',
    description: 'Traditional high-contrast single-column format optimized for automated ATS parsers.'
  }
];

export const resumeService = {
  /**
   * Get resume data for user
   */
  async getUserResume(userId) {
    const fallback = {
      title: 'Senior Software Engineer Resume',
      name: 'Rajesh Kumar Mahato',
      email: 'rajesh@zayathon.com',
      phone: '+91 98765 43210',
      college: 'Institute of Engineering & Technology',
      department: 'Computer Science',
      github: 'https://github.com/rajeshkumarmahato2063-wq',
      linkedin: 'https://linkedin.com/in/rajeshkumarmahato',
      summary: 'Innovator & Full-Stack AI Engineer with expertise in building scalable cloud architectures, autonomous agentic workflows, and real-time security platforms.',
      skills: ['React', 'Node.js', 'Python', 'TypeScript', 'Supabase', 'Agentic AI', 'PostgreSQL', 'TailwindCSS'],
      experience: [
        {
          role: 'Lead Architect & Core Developer',
          company: 'ZayaThon SaaS Platform',
          duration: '2025 - Present',
          details: 'Engineered real-time multi-event hackathon management SaaS platform with live ops broadcasting, AI project copilot, and automated certificate generation.'
        },
        {
          role: 'AI Code Sprint Champion',
          company: 'National HackFest',
          duration: '2026',
          details: 'Built Zero Knowledge intrusion detection engine that won 1st Place out of 150 competing engineering teams.'
        }
      ],
      projects: [
        {
          title: 'ZayaThon Career & Hackathon Platform',
          technologies: 'React, Vite, Supabase, jsPDF',
          description: 'Designed ATS resume generator, recruiter candidate portal, and real-time networking system.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Technology - CS & AI',
          institution: 'Institute of Engineering & Technology',
          year: '2023 - 2027'
        }
      ],
      template_id: 'modern_cyber'
    };

    if (!isSupabaseConfigured() || !userId) return fallback;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return fallback;
      return { ...fallback, ...data };
    } catch {
      return fallback;
    }
  },

  /**
   * AI Improvement Prompts for Summary, Skills, Projects, Experience
   */
  enhanceContentWithAI(section, currentText) {
    if (section === 'summary') {
      return `Results-driven Software Engineer with proven expertise in building high-throughput web applications, autonomous AI agent workflows, and cloud databases. Passionate about solving complex system architecture challenges and building user-first digital products.`;
    }
    if (section === 'skills') {
      return ['React.js', 'Node.js', 'Python (PyTorch)', 'TypeScript', 'Supabase', 'PostgreSQL', 'REST & GraphQL APIs', 'Docker', 'Git / CI/CD'];
    }
    if (section === 'projects') {
      return [
        {
          title: 'Autonomous AI Multi-Agent Network',
          technologies: 'Python, LangChain, OpenAI, FastAPI',
          description: 'Built a multi-agent orchestration framework capable of executing complex code debugging and dataset validation with 98% accuracy.'
        }
      ];
    }
    return currentText;
  },

  /**
   * Save or update resume in database
   */
  async saveResume(userId, resumeData) {
    if (!isSupabaseConfigured()) return resumeData;

    const { data, error } = await supabase
      .from('resumes')
      .upsert({ user_id: userId, ...resumeData, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Export ATS-Friendly Resume PDF via jsPDF
   */
  async downloadResumePDF(resumeData) {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(5, 8, 22);
    doc.text(resumeData.name || 'Candidate Name', margin, y);
    y += 8;

    // Contact Details Line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const contactLine = `${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.college || ''}`;
    doc.text(contactLine, margin, y);
    y += 6;

    const linksLine = `GitHub: ${resumeData.github || ''} | LinkedIn: ${resumeData.linkedin || ''}`;
    doc.text(linksLine, margin, y);
    y += 10;

    // Horizontal Rule
    doc.setDrawColor(0, 229, 255);
    doc.setLineWidth(0.8);
    doc.line(margin, y, 190, y);
    y += 10;

    // Section 1: Professional Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(5, 8, 22);
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const splitSummary = doc.splitTextToSize(resumeData.summary || '', 170);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 5 + 6;

    // Section 2: Technical Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(5, 8, 22);
    doc.text('TECHNICAL SKILLS', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const skillsText = Array.isArray(resumeData.skills) ? resumeData.skills.join(' • ') : resumeData.skills || '';
    const splitSkills = doc.splitTextToSize(skillsText, 170);
    doc.text(splitSkills, margin, y);
    y += splitSkills.length * 5 + 6;

    // Section 3: Key Experience & Hackathons
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(5, 8, 22);
    doc.text('WORK EXPERIENCE & HACKATHONS', margin, y);
    y += 6;

    if (Array.isArray(resumeData.experience)) {
      resumeData.experience.forEach((exp) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(5, 8, 22);
        doc.text(`${exp.role} - ${exp.company} (${exp.duration})`, margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        const splitExp = doc.splitTextToSize(exp.details || '', 170);
        doc.text(splitExp, margin, y);
        y += splitExp.length * 4.5 + 4;
      });
    }

    // Section 4: Projects
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(5, 8, 22);
    doc.text('KEY PROJECTS', margin, y);
    y += 6;

    if (Array.isArray(resumeData.projects)) {
      resumeData.projects.forEach((proj) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(5, 8, 22);
        doc.text(proj.title, margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        const splitProj = doc.splitTextToSize(`Technologies: ${proj.technologies || ''} - ${proj.description || ''}`, 170);
        doc.text(splitProj, margin, y);
        y += splitProj.length * 4.5 + 4;
      });
    }

    // Save PDF
    const filename = `${(resumeData.name || 'Candidate').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`;
    doc.save(filename);
    return true;
  }
};
