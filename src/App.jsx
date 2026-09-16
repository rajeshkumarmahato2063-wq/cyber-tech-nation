import React from 'react';
import Navbar from './components/Navbar';
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
import BackgroundDecorations from './components/ui/BackgroundDecorations';

/**
 * ZAYATHON Application Shell
 * Configured with Phase 2 Cyber-Tech Design System
 */
function App() {
  return (
    <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col font-sans overflow-hidden selection:bg-[#00E5FF] selection:text-[#050816]">
      {/* Reusable Cyber Ambient Background Lighting */}
      <BackgroundDecorations />

      {/* Main UI Layout */}
      <Navbar />
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
      <Footer />
    </div>
  );
}

export default App;
