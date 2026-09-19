import React from 'react';
import ScrollProgress from './ScrollProgress';
import CursorGlow from './CursorGlow';
import MaintenanceBanner from './MaintenanceBanner';
import EmergencyBroadcastBanner from './EmergencyBroadcastBanner';
import ParticlesBackground from './ParticlesBackground';
import BackgroundDecorations from './ui/BackgroundDecorations';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import ChatWidget from './ChatWidget';
import SectionErrorBoundary from './SectionErrorBoundary';

/**
 * Shared Application Layout Shell
 * Integrates navigation, theme background, global banners, footers, and isolated section error handling.
 */
const Layout = ({
  children,
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
  return (
    <>
      {/* Scroll Progress Indicator */}
      <SectionErrorBoundary name="ScrollProgress">
        <ScrollProgress />
      </SectionErrorBoundary>

      {/* Custom Pointer Glow */}
      <SectionErrorBoundary name="CursorGlow">
        <CursorGlow />
      </SectionErrorBoundary>

      {/* Global Banners */}
      <SectionErrorBoundary name="MaintenanceBanner">
        <MaintenanceBanner />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="EmergencyBroadcastBanner">
        <EmergencyBroadcastBanner />
      </SectionErrorBoundary>

      {/* Application Shell */}
      <div className="relative min-h-screen bg-[var(--bg,#050816)] text-[var(--text,#F8FAFC)] flex flex-col font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#050816] theme-transition">
        {/* Particle Canvas Background */}
        <SectionErrorBoundary name="ParticlesBackground">
          <ParticlesBackground />
        </SectionErrorBoundary>

        {/* Ambient Lighting & Cyber Orbs */}
        <SectionErrorBoundary name="BackgroundDecorations">
          <BackgroundDecorations />
        </SectionErrorBoundary>

        {/* Header / Sticky Navigation */}
        <SectionErrorBoundary name="Navbar">
          <Navbar
            user={user}
            onOpenAuth={onOpenAuth}
            onOpenAdmin={onOpenAdmin}
            onOpenUserDashboard={onOpenUserDashboard}
            onOpenJudgePortal={onOpenJudgePortal}
            onOpenLiveDashboard={onOpenLiveDashboard}
            onLogout={onLogout}
            onNavigate={onNavigate}
            currentRoute={currentRoute}
          />
        </SectionErrorBoundary>

        {/* Main Content View Slot */}
        <main className="flex-1 z-10">
          <SectionErrorBoundary name="MainContent">
            {children}
          </SectionErrorBoundary>
        </main>

        {/* Global Footer */}
        <SectionErrorBoundary name="Footer">
          <Footer />
        </SectionErrorBoundary>

        {/* Floating Utilities */}
        <SectionErrorBoundary name="BackToTop">
          <BackToTop />
        </SectionErrorBoundary>

        <SectionErrorBoundary name="ChatWidget">
          <ChatWidget />
        </SectionErrorBoundary>
      </div>
    </>
  );
};

export default Layout;
