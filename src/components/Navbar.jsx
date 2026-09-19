import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, Rocket, User, ShieldAlert, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';


/**
 * Sticky Glassmorphism Navbar with Mobile Drawer, Active Scroll Highlighting, Auth & Admin Controls
 */
const Navbar = ({
  user,
  onOpenAuth,
  onOpenAdmin,
  onOpenUserDashboard,
  onOpenJudgePortal,
  onOpenLiveDashboard,
  onLogout,
  onNavigate,
  currentRoute = '/'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isJudge = user?.profile?.role === 'judge' || user?.user_metadata?.role === 'judge' || user?.profile?.role === 'admin';
  const isAdmin = user?.profile?.role === 'admin' || user?.profile?.role === 'organizer' || user?.user_metadata?.role === 'admin';

  const navLinks = [
    { name: 'Home', href: '#hero', route: '/' },
    { name: 'Events', href: '/events', route: '/events' },
    { name: 'Team Match', href: '/team-match', route: '/team-match' },
    { name: 'Portfolios', href: '/profile/rajesh-mahato', route: '/profile' },
    { name: 'AI Resume', href: '/resume-builder', route: '/resume-builder' },
    { name: 'Recruiters', href: '/recruiter', route: '/recruiter' },
    { name: 'Networking', href: '/networking', route: '/networking' },
    { name: 'Leaderboard', href: '/leaderboard', route: '/leaderboard' },
    { name: 'Archive', href: '/archive', route: '/archive' },
  ];

  if (isAdmin) {
    navLinks.splice(2, 0, { name: 'Organizer Hub', href: '/organizer', route: '/organizer' });
  }

  // Scroll listener for sticky background & active section detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Determine active section based on scroll offset
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (typeof link === 'object') {
      if (link.href.startsWith('/')) {
        if (onNavigate) onNavigate(link.href);
        return;
      }
      if (currentRoute !== '/' && onNavigate) {
        onNavigate('/');
        setTimeout(() => {
          const elem = document.getElementById(link.href.substring(1));
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
      const targetId = link.href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (link.startsWith('/')) {
        if (onNavigate) onNavigate(link);
        return;
      }
      const targetId = link.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050816]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2 text-lg lg:text-xl font-extrabold tracking-wider group cursor-pointer shrink-0"
        >
          <div className="p-1.5 lg:p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300">
            <Terminal className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
          </div>
          <span className="font-title text-xl lg:text-2xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            ZAYATHON<span className="text-cyan-400 font-sans">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 lg:gap-1 bg-[#0B1120]/70 backdrop-blur-md px-2.5 lg:px-3 py-1 rounded-full border border-white/10 shadow-inner">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith('/')
              ? currentRoute === link.route
              : currentRoute === '/' && activeSection === link.href.substring(1);

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative px-2.5 lg:px-3 py-1 text-xs lg:text-xs font-medium transition-all duration-300 rounded-full whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Desktop Action CTA & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-1.5 lg:gap-2 shrink-0">
          <ThemeToggle />
          <NotificationBell user={user} />

          {/* Live Arena Trigger */}
          <button
            onClick={onOpenLiveDashboard}
            className="p-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
            title="Open Live Broadcast Arena"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Arena</span>
          </button>

          {/* Judge Portal Trigger */}
          {isJudge && (
            <button
              onClick={onOpenJudgePortal}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title="Open Judge Portal"
            >
              <span>Judge</span>
            </button>
          )}

          {/* Admin Dashboard Trigger */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all font-mono text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title="Open Admin Dashboard"
            >
              <ShieldAlert className="w-3 h-3 text-purple-400" />
              <span>Admin</span>
            </button>
          )}

          {/* User Auth Profile Dropdown or Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono font-semibold max-w-[80px] truncate">
                  {user.profile?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0B1120] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 font-mono text-xs">
                  <div className="px-3 py-2 border-b border-white/10 text-slate-400 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenUserDashboard) onOpenUserDashboard();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-cyan-300 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" /> My Dashboard
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-purple-300 flex items-center gap-2"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 hover:bg-white/10 transition-all font-semibold"
            >
              Sign In
            </button>
          )}

          <a href="#register" onClick={(e) => handleNavClick(e, '#register')}>
            <Button variant="primary" icon={Rocket} iconPosition="right" className="!py-2.5 !px-5 text-xs">
              Register Now
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger Toggle & Theme Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <button
              onClick={() => onLogout()}
              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono"
            >
              Login
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#050816]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.href.startsWith('/')
                  ? currentRoute === link.route
                  : currentRoute === '/' && activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}

              {isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-sm"
                >
                  🛡️ Admin Command Center
                </button>
              )}

              <div className="pt-2 border-t border-white/10">
                <a href="#register" onClick={(e) => handleNavClick(e, '#register')} className="w-full block">
                  <Button variant="primary" icon={Rocket} className="w-full justify-center">
                    Register Now
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
