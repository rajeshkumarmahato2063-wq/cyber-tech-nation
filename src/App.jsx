import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Loader from './components/Loader';
import ParticlesBackground from './components/ParticlesBackground';
import CursorGlow from './components/CursorGlow';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import Navbar from './components/Navbar';
import BackgroundDecorations from './components/ui/BackgroundDecorations';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import useAuth from './hooks/useAuth';

import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Domains from './components/Domains';
import Timeline from './components/Timeline';
import Prizes from './components/Prizes';
import Sponsors from './components/Sponsors';
import Team from './components/Team';
import Register from './components/Register';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

import JudgePortal from './components/JudgePortal';
import LiveEventDashboard from './components/LiveEventDashboard';

/**
 * ZAYATHON Application Shell - Production Ready
 */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [judgePortalOpen, setJudgePortalOpen] = useState(false);
  const [liveDashboardOpen, setLiveDashboardOpen] = useState(false);

  // Initialize Auth state via custom useAuth hook
  const { user, profile, isAuthenticated, isAdmin, signOut, refreshUser } = useAuth();

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <>
      {/* 1. Initial Animated Boot Loader */}
      <AnimatePresence>
        {initialLoading && <Loader onComplete={() => setInitialLoading(false)} />}
      </AnimatePresence>

      {/* 2. Top Window Scroll Progress Bar */}
      <ScrollProgress />

      {/* 3. Custom Desktop Glowing Pointer */}
      <CursorGlow />

      <div className="relative min-h-screen bg-[var(--bg,#050816)] text-[var(--text,#F8FAFC)] flex flex-col font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#050816] theme-transition">
        {/* 4. Canvas Particle Network Background */}
        <ParticlesBackground />

        {/* 5. Ambient Cyber Background Lighting & Orbs */}
        <BackgroundDecorations />

        {/* 6. Sticky Navbar with Auth Controls, Judge Portal & Theme Toggle */}
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={() => setAdminDashboardOpen(true)}
          onOpenUserDashboard={() => setUserDashboardOpen(true)}
          onOpenJudgePortal={() => setJudgePortalOpen(true)}
          onOpenLiveDashboard={() => setLiveDashboardOpen(true)}
          onLogout={handleLogout}
        />

        {/* 7. Main Application Flow */}
        <main className="flex-1 z-10">
          <Hero />
          <About />
          <Stats />
          <Domains />
          <Timeline />
          <Prizes />
          <Sponsors />
          <Team />
          <Register />
          <FAQ />
          <Contact />
        </main>

        {/* 8. Footer */}
        <Footer />

        {/* 9. Floating Back To Top Button */}
        <BackToTop />

        {/* 10. Live AI Chat Assistant Widget */}
        <ChatWidget />

        {/* 11. Auth Modal (Sign In / Sign Up / Forgot Password) */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={() => {
            refreshUser();
          }}
        />

        {/* 12. User Participant Dashboard Modal */}
        <UserDashboard
          isOpen={userDashboardOpen}
          onClose={() => setUserDashboardOpen(false)}
          user={user}
        />

        {/* 13. Admin Command Center Dashboard Modal */}
        <AdminDashboard
          isOpen={adminDashboardOpen}
          onClose={() => setAdminDashboardOpen(false)}
        />

        {/* 14. Judge Evaluation Portal Modal */}
        <JudgePortal
          isOpen={judgePortalOpen}
          onClose={() => setJudgePortalOpen(false)}
          user={user}
        />

        {/* 15. Public Live Event Broadcast Arena Modal */}
        <LiveEventDashboard
          isOpen={liveDashboardOpen}
          onClose={() => setLiveDashboardOpen(false)}
        />
      </div>
    </>
  );
}

export default App;

