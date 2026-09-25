import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import Loader from './components/Loader';
import SectionErrorBoundary from './components/SectionErrorBoundary';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import JudgePortal from './components/JudgePortal';
import LiveEventDashboard from './components/LiveEventDashboard';
import useAuth from './hooks/useAuth';

// Dedicated Homepage View
import HomePage from './pages/Home';

// Multi-Event & Career Platform Pages
import EventsPage from './pages/Events';
import EventDetailsPage from './pages/EventDetails';
import EventArchivePage from './pages/EventArchive';
import OrganizerDashboardPage from './pages/Organizer';
import PortfolioPage from './pages/Portfolio';
import ResumeBuilderPage from './pages/ResumeBuilder';
import NetworkingHubPage from './pages/Networking';
import LeaderboardPage from './pages/Leaderboard';
import TeamMatchPage from './pages/TeamMatch';

// AI Mentor Hub Pages
import MentorsPage from './pages/Mentors';
import MentorDetailsPage from './pages/Mentors/MentorDetails';
import BookingPage from './pages/Booking';
import OfficeHoursPage from './pages/OfficeHours';
import AIReviewPage from './pages/AIReview';

/**
 * ZAYATHON Application Root Shell
 * Multi-Event SaaS & AI Career Platform
 */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [judgePortalOpen, setJudgePortalOpen] = useState(false);
  const [liveDashboardOpen, setLiveDashboardOpen] = useState(false);

  // Client-Side Routing State
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [selectedRegisterEvent, setSelectedRegisterEvent] = useState(null);
  const [chatTargetUserId, setChatTargetUserId] = useState(null);

  // Auth Hook
  const { user, profile, isAdmin, signOut, refreshUser } = useAuth();

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
  const route = (currentRoute.length > 1 && currentRoute.endsWith('/')) ? currentRoute.slice(0, -1) : currentRoute;
  const isProfileRoute = route.startsWith('/profile') || route.startsWith('/portfolio');
  const profileUsername = isProfileRoute ? (route.split('/')[2] || 'rajesh-mahato') : 'rajesh-mahato';

  return (
    <Layout
      user={user}
      onOpenAuth={handleOpenAuth}
      onOpenAdmin={() => setAdminDashboardOpen(true)}
      onOpenUserDashboard={() => setUserDashboardOpen(true)}
      onOpenJudgePortal={() => setJudgePortalOpen(true)}
      onOpenLiveDashboard={() => setLiveDashboardOpen(true)}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentRoute={currentRoute}
    >
      {/* Initial Boot Loader Animation */}
      <AnimatePresence>
        {initialLoading && <Loader onComplete={() => setInitialLoading(false)} />}
      </AnimatePresence>

      {/* Main View Router */}
      {route === '/events' ? (
        <SectionErrorBoundary name="EventsPage">
          <EventsPage
            onViewEventDetails={(slug) => handleNavigate(`/events/${slug}`)}
            onOpenRegister={handleOpenRegisterForEvent}
            onOpenCreateEvent={() => setAdminDashboardOpen(true)}
            isAdminOrOrganizer={isOrganizerOrAdmin}
          />
        </SectionErrorBoundary>
      ) : route.startsWith('/events/') ? (
        <SectionErrorBoundary name="EventDetailsPage">
          <EventDetailsPage
            slug={route.replace('/events/', '')}
            onBack={() => handleNavigate('/events')}
            onOpenRegister={handleOpenRegisterForEvent}
          />
        </SectionErrorBoundary>
      ) : route === '/archive' ? (
        <SectionErrorBoundary name="EventArchivePage">
          <EventArchivePage />
        </SectionErrorBoundary>
      ) : route === '/organizer' ? (
        <SectionErrorBoundary name="OrganizerDashboardPage">
          <OrganizerDashboardPage user={user} />
        </SectionErrorBoundary>
      ) : isProfileRoute ? (
        <SectionErrorBoundary name="PortfolioPage">
          <PortfolioPage
            username={profileUsername}
            currentUser={user}
            onOpenChat={handleOpenChatWithUser}
          />
        </SectionErrorBoundary>
      ) : route === '/resume-builder' ? (
        <SectionErrorBoundary name="ResumeBuilderPage">
          <ResumeBuilderPage user={user} />
        </SectionErrorBoundary>
      ) : route === '/recruiter' ? (
        <SectionErrorBoundary name="RecruiterDashboardPage">
          <RecruiterDashboardPage
            onViewPortfolio={(uname) => handleNavigate(`/profile/${uname}`)}
          />
        </SectionErrorBoundary>
      ) : route === '/networking' ? (
        <SectionErrorBoundary name="NetworkingHubPage">
          <NetworkingHubPage
            currentUser={user}
            targetUserId={chatTargetUserId}
          />
        </SectionErrorBoundary>
      ) : route === '/leaderboard' ? (
        <SectionErrorBoundary name="LeaderboardPage">
          <LeaderboardPage
            onViewPortfolio={(uname) => handleNavigate(`/profile/${uname}`)}
          />
        </SectionErrorBoundary>
      ) : route === '/team-match' ? (
        <SectionErrorBoundary name="TeamMatchPage">
          <TeamMatchPage />
        </SectionErrorBoundary>
      ) : route === '/mentors' ? (
        <SectionErrorBoundary name="MentorsPage">
          <MentorsPage user={user} onNavigate={handleNavigate} />
        </SectionErrorBoundary>
      ) : route.startsWith('/mentor/') ? (
        <SectionErrorBoundary name="MentorDetailsPage">
          <MentorDetailsPage
            mentorId={route.replace('/mentor/', '')}
            user={user}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('/mentors')}
          />
        </SectionErrorBoundary>
      ) : route === '/book-session' ? (
        <SectionErrorBoundary name="BookingPage">
          <BookingPage user={user} onNavigate={handleNavigate} />
        </SectionErrorBoundary>
      ) : route === '/office-hours' ? (
        <SectionErrorBoundary name="OfficeHoursPage">
          <OfficeHoursPage user={user} onNavigate={handleNavigate} />
        </SectionErrorBoundary>
      ) : route === '/ai-review' ? (
        <SectionErrorBoundary name="AIReviewPage">
          <AIReviewPage user={user} onNavigate={handleNavigate} />
        </SectionErrorBoundary>
      ) : (
        /* Flagship Home Page Component */
        <SectionErrorBoundary name="HomePage">
          <HomePage selectedRegisterEvent={selectedRegisterEvent} />
        </SectionErrorBoundary>
      )}

      {/* Auth Modal */}
      <SectionErrorBoundary name="AuthModal">
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          onAuthSuccess={() => refreshUser()}
        />
      </SectionErrorBoundary>

      {/* Participant User Dashboard */}
      <SectionErrorBoundary name="UserDashboard">
        <UserDashboard
          isOpen={userDashboardOpen}
          onClose={() => setUserDashboardOpen(false)}
          user={user}
        />
      </SectionErrorBoundary>

      {/* Admin Dashboard */}
      <SectionErrorBoundary name="AdminDashboard">
        <AdminDashboard
          isOpen={adminDashboardOpen}
          onClose={() => setAdminDashboardOpen(false)}
        />
      </SectionErrorBoundary>

      {/* Judge Evaluation Portal */}
      <SectionErrorBoundary name="JudgePortal">
        <JudgePortal
          isOpen={judgePortalOpen}
          onClose={() => setJudgePortalOpen(false)}
          user={user}
        />
      </SectionErrorBoundary>

      {/* Live Broadcast Arena */}
      <SectionErrorBoundary name="LiveEventDashboard">
        <LiveEventDashboard
          isOpen={liveDashboardOpen}
          onClose={() => setLiveDashboardOpen(false)}
          user={user}
        />
      </SectionErrorBoundary>
    </Layout>
  );
}

export default App;
