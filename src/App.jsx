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
import MaintenanceBanner from './components/MaintenanceBanner';
import EmergencyBroadcastBanner from './components/EmergencyBroadcastBanner';

// Multi-Event & Career Platform Pages
import EventsPage from './pages/Events';
import EventDetailsPage from './pages/EventDetails';
import EventArchivePage from './pages/EventArchive';
import OrganizerDashboardPage from './pages/Organizer';
import PortfolioPage from './pages/Portfolio';
import ResumeBuilderPage from './pages/ResumeBuilder';
import RecruiterDashboardPage from './pages/Recruiter';
import NetworkingHubPage from './pages/Networking';
import LeaderboardPage from './pages/Leaderboard';

/**
 * ZAYATHON Application Shell - Hackathon & Career Platform Ready
 */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [judgePortalOpen, setJudgePortalOpen] = useState(false);
  const [liveDashboardOpen, setLiveDashboardOpen] = useState(false);

  // Client-Side Routing State
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState(null);
  const [chatTargetUserId, setChatTargetUserId] = useState(null);

  // Initialize Auth state via custom useAuth hook
  const { user, profile, isAuthenticated, isAdmin, signOut, refreshUser } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleOpenRegisterForEvent = (evt) => {
    setSelectedRegisterEvent(evt);
    if (currentRoute !== '/') {
      handleNavigate('/');
    }
    setTimeout(() => {
      const elem = document.getElementById('register');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleOpenChatWithUser = (targetUserId) => {
    setChatTargetUserId(targetUserId);
    handleNavigate('/networking');
  };

  const isOrganizerOrAdmin = isAdmin || profile?.role === 'organizer' || user?.user_metadata?.role === 'organizer';

  // Determine current profile username from route if viewing /profile/:username
  const isProfileRoute = currentRoute.startsWith('/profile') || currentRoute.startsWith('/portfolio');
  const profileUsername = isProfileRoute ? (currentRoute.split('/')[2] || 'rajesh-mahato') : 'rajesh-mahato';

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

      {/* Maintenance Mode Banner */}
      <MaintenanceBanner />

      {/* Realtime Emergency Operations Broadcast Banner */}
      <EmergencyBroadcastBanner />

      <div className="relative min-h-screen bg-[var(--bg,#050816)] text-[var(--text,#F8FAFC)] flex flex-col font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#050816] theme-transition">
        {/* 4. Canvas Particle Network Background */}
        <ParticlesBackground />

        {/* 5. Ambient Cyber Background Lighting & Orbs */}
        <BackgroundDecorations />

        {/* 6. Sticky Navbar with Auth Controls, Career Platform Routing & Theme Toggle */}
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onOpenAdmin={() => setAdminDashboardOpen(true)}
          onOpenUserDashboard={() => setUserDashboardOpen(true)}
          onOpenJudgePortal={() => setJudgePortalOpen(true)}
          onOpenLiveDashboard={() => setLiveDashboardOpen(true)}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentRoute={currentRoute}
        />

        {/* 7. Main Application Routing View */}
        <main className="flex-1 z-10">
          {currentRoute === '/events' ? (
            <EventsPage
              onViewEventDetails={(slug) => handleNavigate(`/events/${slug}`)}
              onOpenRegister={handleOpenRegisterForEvent}
              onOpenCreateEvent={() => setAdminDashboardOpen(true)}
              isAdminOrOrganizer={isOrganizerOrAdmin}
            />
          ) : currentRoute.startsWith('/events/') ? (
            <EventDetailsPage
              slug={currentRoute.replace('/events/', '')}
              onBack={() => handleNavigate('/events')}
              onOpenRegister={handleOpenRegisterForEvent}
            />
          ) : currentRoute === '/archive' ? (
            <EventArchivePage />
          ) : currentRoute === '/organizer' ? (
            <OrganizerDashboardPage user={user} />
          ) : isProfileRoute ? (
            <PortfolioPage
              username={profileUsername}
              currentUser={user}
              onOpenChat={handleOpenChatWithUser}
            />
          ) : currentRoute === '/resume-builder' ? (
            <ResumeBuilderPage user={user} />
          ) : currentRoute === '/recruiter' ? (
            <RecruiterDashboardPage
              onViewPortfolio={(uname) => handleNavigate(`/profile/${uname}`)}
            />
          ) : currentRoute === '/networking' ? (
            <NetworkingHubPage
              currentUser={user}
              targetUserId={chatTargetUserId}
            />
          ) : currentRoute === '/leaderboard' ? (
            <LeaderboardPage
              onViewPortfolio={(uname) => handleNavigate(`/profile/${uname}`)}
            />
          ) : (
            /* Default Flagship Home Page View */
            <>
              <Hero />
              <About />
              <Stats />
              <Domains />
              <Timeline />
              <Prizes />
              <Sponsors />
              <Team />
              <Register selectedEvent={selectedRegisterEvent} eventId={selectedRegisterEvent?.id} />
              <FAQ />
              <Contact />
            </>
          )}
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
          user={user}
        />
      </div>
    </>
  );
}

export default App;
