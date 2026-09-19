import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Stats from '../components/Stats';
import Domains from '../components/Domains';
import Timeline from '../components/Timeline';
import Prizes from '../components/Prizes';
import Sponsors from '../components/Sponsors';
import Team from '../components/Team';
import Register from '../components/Register';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import SectionErrorBoundary from '../components/SectionErrorBoundary';

/**
 * Flagship ZAYATHON Homepage View
 * Mounts all 11 core hackathon sections with isolated error boundaries.
 */
const HomePage = ({ selectedRegisterEvent }) => {
  return (
    <div className="w-full flex flex-col min-h-full">
      <SectionErrorBoundary name="Hero">
        <Hero />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="About">
        <About />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Stats">
        <Stats />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Domains">
        <Domains />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Timeline">
        <Timeline />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Prizes">
        <Prizes />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Sponsors">
        <Sponsors />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Team">
        <Team />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Register">
        <Register selectedEvent={selectedRegisterEvent} eventId={selectedRegisterEvent?.id} />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="FAQ">
        <FAQ />
      </SectionErrorBoundary>

      <SectionErrorBoundary name="Contact">
        <Contact />
      </SectionErrorBoundary>
    </div>
  );
};

export default HomePage;
