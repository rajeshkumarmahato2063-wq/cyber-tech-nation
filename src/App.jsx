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

/**
 * Main Application Shell for ZAYATHON Website
 * Renders sections in designated order for Phase 1 project setup
 */
function App() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
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
