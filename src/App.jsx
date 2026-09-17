import React, { useState, useEffect } from 'react';
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
import { authService } from './services/auth';

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

/**
 * ZAYATHON Application Shell
 */
function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Initialize and listen to Auth session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (err) {
        console.warn('Auth initialization fallback:', err.message);
      }
    };
    initAuth();

    const subscription = authService.onAuthStateChange((event, session, profile) => {
      if (session?.user) {
        setUser({ ...session.user, profile });
      } else {
        setUser(null);
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <>
      {/* 1. Initial Animated Boot Loader */}
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* 2. Top Window Scroll Progress Bar */}
      <ScrollProgress />

      {/* 3. Custom Desktop Glowing Pointer */}
      <CursorGlow />

      <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#050816] theme-transition">
        {/* 4. Canvas Particle Network Background */}
        <ParticlesBackground />

        {/* 5. Ambient Cyber Background Lighting & Orbs */}
        <BackgroundDecorations />

        {/* 6. Sticky Navbar with Auth Controls & Theme Toggle */}
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={() => setAdminDashboardOpen(true)}
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
          onAuthSuccess={(data) => {
            if (data?.user) {
              setUser({ ...data.user, profile: data.profile });
            }
          }}
        />

        {/* 12. Admin Command Center Dashboard */}
        <AdminDashboard
          isOpen={adminDashboardOpen}
          onClose={() => setAdminDashboardOpen(false)}
        />
      </div>
    </>
  );
}

export default App;
