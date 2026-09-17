import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, User, MessageSquare } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';

/**
 * Organizer Quick Contact Cards Data
 */
const QUICK_CONTACT_ORGANIZERS = [
  {
    name: 'Rahul Kumar Yadav',
    role: 'Lead Organizer',
    phone: '+91 98765 43210',
    email: 'rahul@zayathon.tech'
  },
  {
    name: 'Aditya Chaurasiya',
    role: 'Technical Head',
    phone: '+91 91234 56789',
    email: 'aditya@zayathon.tech'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="section-container relative z-10 overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Section Title */}
      <SectionTitle 
        badge="Reach Out"
        title="GET IN TOUCH"
        subtitle="Have questions regarding team formation, venue, or sponsorship? Reach out to our organizing team anytime."
      />

      {/* Two Column Layout: Left Details + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto pt-2">
        {/* Left Side: Contact Information, Organizer Cards & Google Maps */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Main Info Card */}
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0B1120]/80 backdrop-blur-xl border border-white/10 shadow-lg space-y-5">
            <h3 className="text-xl font-bold text-white tracking-tight border-b border-white/10 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Contact Details
            </h3>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block">Official Support Email</span>
                <a href="mailto:support@zayathon.tech" className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                  support@zayathon.tech
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block">Organizer Hotline</span>
                <a href="tel:+919876543210" className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                  +91 98765 43210 / +91 91234 56789
                </a>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 block">Event Venue</span>
                <p className="text-sm font-bold text-white">
                  ZAYATHON Innovation Hub & Virtual Arena
                </p>
                <p className="text-xs text-slate-400">Main Campus Tech Park, Sector 62</p>
              </div>
            </div>
          </div>

          {/* Organizer Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_CONTACT_ORGANIZERS.map((org, oIdx) => (
              <div key={oIdx} className="rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">{org.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-cyan-400 block mb-2">{org.role}</span>
                <span className="text-[11px] text-slate-300 font-mono block">{org.phone}</span>
              </div>
            ))}
          </div>

          {/* Embedded Google Maps iframe */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-lg h-52 relative">
            <iframe
              title="ZAYATHON Venue Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562066898492!2d77.3592!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjhCsDM2JzUwLjAiTiA3N8KwMjEnMzMuMSJF!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Right Side: Interactive Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <div className="relative rounded-3xl p-7 sm:p-9 bg-[#0B1120]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_0_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-3xl" />

            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Send Us a Message
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Have a specific question? Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-slate-300 text-xs max-w-xs mx-auto">
                  Thank you for reaching out. We have received your query and will reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="cyber-input"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="cyber-input"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Query regarding Agentic AI track"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="cyber-input"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Write your question or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="cyber-input resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full neon-button py-3.5 rounded-xl font-bold text-sm text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all hover:scale-[1.01]"
                >
                  {isSending ? (
                    'Sending Message...'
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
