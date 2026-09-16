import React from 'react';
import { Layers } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';

const Domains = () => {
  return (
    <section id="domains" className="section-container relative z-10">
      <SectionTitle 
        badge="Hackathon Tracks"
        title="TRACKS & DOMAINS"
        subtitle="Select from groundbreaking tracks designed to tackle pressing technology frontiers."
      />
    </section>
  );
};

export default Domains;
