import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Users, 
  Mail, 
  Phone, 
  School, 
  GraduationCap, 
  Calendar, 
  Layers, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Edit3, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import RegistrationStepper from './RegistrationStepper';
import TeamMemberForm from './TeamMemberForm';
import SuccessModal from './SuccessModal';

/**
 * 9 Innovation Domains List
 */
const DOMAIN_OPTIONS = [
  'Agentic AI',
  'Robotics & Autonomous Systems',
  'Cybersecurity',
  'HealthTech & MedAI',
  'FinTech & Blockchain',
  'Smart Cities & IoT',
  'Agritech',
  'Transportation & Logistics',
  'Open Innovation'
];

/**
 * Year of Study Options
 */
const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate / Other'
];

const Register = () => {
  // Current Form Step (1: Leader, 2: Members, 3: Review, 4: Success)
  const [step, setStep] = useState(1);

  // Main Form Data State
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    domain: 'Agentic AI',
    members: [] // [{ id: Date.now(), name: '', email: '', department: '' }]
  });

  // Validation Error Object
  const [errors, setErrors] = useState({});

  // Submission & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  /**
   * Field Change Handler for Step 1
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Team Member Handlers for Step 2
   */
  const handleAddMember = () => {
    // Max 4 total members (1 leader + 3 members)
    if (formData.members.length >= 3) return;

    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { id: Date.now(), name: '', email: '', department: '' }
      ]
    }));
  };

  const handleRemoveMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id)
    }));
    // Clear member specific errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`member_${id}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleMemberChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      )
    }));

    const errorKey = `member_${id}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  /**
   * Step 1 Validation
   */
  const validateStep1 = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.teamName.trim()) errs.teamName = 'Team Name is required';
    if (!formData.leaderName.trim()) errs.leaderName = 'Leader Name is required';

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Invalid email address format';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\D/g, ''))) {
      errs.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.college.trim()) errs.college = 'College/University is required';
    if (!formData.department.trim()) errs.department = 'Department is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /**
   * Step 2 Validation
   */
  const validateStep2 = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formData.members.forEach((m) => {
      if (!m.name.trim()) {
        errs[`member_${m.id}_name`] = 'Full Name is required';
      }
      if (!m.email.trim()) {
        errs[`member_${m.id}_email`] = 'Email is required';
      } else if (!emailRegex.test(m.email.trim())) {
        errs[`member_${m.id}_email`] = 'Invalid email format';
      }
      if (!m.department.trim()) {
        errs[`member_${m.id}_department`] = 'Department is required';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /**
   * Step Navigation Handlers
   */
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step < 4) {
      setStep((prev) => prev - 1);
    }
  };

  /**
   * Final Submission Handler (Step 3 -> Step 4)
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async API registration submission
    setTimeout(() => {
      const regId = `ZYT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        regId,
        teamName: formData.teamName,
        leaderName: formData.leaderName,
        domain: formData.domain,
        totalMembers: 1 + formData.members.length
      };

      setRegisteredData(payload);
      setIsSubmitting(false);
      setStep(4);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  return (
    <section id="register" className="section-container relative z-10 overflow-hidden">
      {/* Background Cyber Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Title */}
      <SectionTitle 
        badge="Join The Movement"
        title="MULTI-STEP REGISTRATION"
        subtitle="100% Free Entry. Form your squad, choose your domain, and battle for victory."
      />

      {/* Progress Stepper */}
      <RegistrationStepper currentStep={step} />

      {/* Form Container Card */}
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_0_rgba(0,0,0,0.5)]">
          {/* Top Border Glow Glare */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-3xl" />

          <AnimatePresence mode="wait">
            {/* STEP 1: Team & Leader Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Step 1: Team & Leader Details
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Fields marked * are required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Team Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> Team Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Knights"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      className={`cyber-input ${errors.teamName ? 'input-error' : ''}`}
                    />
                    {errors.teamName && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.teamName}</span>}
                  </div>

                  {/* Leader Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" /> Leader Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Kumar"
                      value={formData.leaderName}
                      onChange={(e) => handleInputChange('leaderName', e.target.value)}
                      className={`cyber-input ${errors.leaderName ? 'input-error' : ''}`}
                    />
                    {errors.leaderName && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.leaderName}</span>}
                  </div>

                  {/* Leader Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="leader@college.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`cyber-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.email}</span>}
                  </div>

                  {/* Leader Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`cyber-input ${errors.phone ? 'input-error' : ''}`}
                    />
                    {errors.phone && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.phone}</span>}
                  </div>

                  {/* College / Institution */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-cyan-400" /> College / Institution <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ABC Institute of Technology"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      className={`cyber-input ${errors.college ? 'input-error' : ''}`}
                    />
                    {errors.college && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.college}</span>}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Department <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science Engineering"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`cyber-input ${errors.department ? 'input-error' : ''}`}
                    />
                    {errors.department && <span className="block text-xs text-rose-400 mt-1 font-medium">{errors.department}</span>}
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="cyber-input bg-[#0B1120]"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y} className="bg-[#0B1120] text-white">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Domain */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> Innovation Domain Track <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="cyber-input bg-[#0B1120]"
                    >
                      {DOMAIN_OPTIONS.map((d) => (
                        <option key={d} value={d} className="bg-[#0B1120] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Next Step Control */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="neon-button px-6 py-3 rounded-xl font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"
                  >
                    Continue to Members <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Team Members */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Step 2: Team Members
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Team Leader + Additional Members (Total limit: <strong>4 Members max</strong>)
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {1 + formData.members.length} / 4 Members
                  </span>
                </div>

                {/* Leader Summary Pill */}
                <div className="rounded-xl p-4 bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      TL
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Team Leader</span>
                      <span className="text-sm font-bold text-white">{formData.leaderName}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    {formData.email}
                  </span>
                </div>

                {/* Additional Dynamic Team Members List */}
                {formData.members.map((member, idx) => (
                  <TeamMemberForm
                    key={member.id}
                    member={member}
                    index={idx}
                    onChange={handleMemberChange}
                    onRemove={handleRemoveMember}
                    errors={{
                      name: errors[`member_${member.id}_name`],
                      email: errors[`member_${member.id}_email`],
                      department: errors[`member_${member.id}_department`]
                    }}
                  />
                ))}

                {/* Add Member Button */}
                {formData.members.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-cyan-500/10 text-cyan-400 border border-dashed border-cyan-500/30 hover:border-cyan-400 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 mb-6"
                  >
                    <Plus className="w-4 h-4" /> Add Team Member #{formData.members.length + 2}
                  </button>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="neon-button px-6 py-3 rounded-xl font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"
                  >
                    Review Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review All Data & Confirmation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    Step 3: Review Registration Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Info
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Team & Leader Panel */}
                  <div className="rounded-2xl p-5 bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-xs border-b border-white/10 pb-2">
                      Team & Leader Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block text-xs">Team Name:</span>
                        <span className="font-bold text-white">{formData.teamName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Domain Track:</span>
                        <span className="font-bold text-cyan-300">{formData.domain}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Leader Name:</span>
                        <span className="font-bold text-white">{formData.leaderName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Leader Email:</span>
                        <span className="font-bold text-white">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Phone:</span>
                        <span className="font-bold text-white">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">College:</span>
                        <span className="font-bold text-white">{formData.college} ({formData.year})</span>
                      </div>
                    </div>
                  </div>

                  {/* Members Roster Panel */}
                  <div className="rounded-2xl p-5 bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        Team Roster ({1 + formData.members.length} Members)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Members
                      </button>
                    </div>

                    <div className="space-y-2">
                      {/* Leader */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs">
                        <span className="font-bold text-white">1. {formData.leaderName} (Leader)</span>
                        <span className="text-slate-400">{formData.department}</span>
                      </div>

                      {/* Additional Members */}
                      {formData.members.map((m, idx) => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs">
                          <span className="font-bold text-white">{idx + 2}. {m.name}</span>
                          <span className="text-slate-400">{m.email} • {m.department}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submission Action */}
                <form onSubmit={handleSubmit} className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neon-button px-8 py-3.5 rounded-xl font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Confirm & Submit <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success Confirmation Screen */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2">Registration Complete!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                  Your team entry has been recorded. Check your email for orientation links and track guides.
                </p>

                <div className="inline-flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSuccessModalOpen(true)}
                    className="neon-button px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white"
                  >
                    View Pass Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        teamName: '',
                        leaderName: '',
                        email: '',
                        phone: '',
                        college: '',
                        department: '',
                        year: '3rd Year',
                        domain: 'Agentic AI',
                        members: []
                      });
                    }}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider border border-white/10"
                  >
                    Register Another Team
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Modal Popup */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        registrationData={registeredData}
      />
    </section>
  );
};

export default Register;
