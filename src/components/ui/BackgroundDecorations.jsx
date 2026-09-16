import React from 'react';

/**
 * Optimized Ambient Cyber-Tech Background Lighting & Grid Effects
 */
const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Cyan Ambient Glow Orb */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />

      {/* Top Left Purple Ambient Glow Orb */}
      <div className="absolute top-1/4 -left-32 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px]" />

      {/* Center Right Blue Ambient Glow Orb */}
      <div className="absolute top-2/3 -right-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />

      {/* Subtle Digital Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};

export default BackgroundDecorations;
