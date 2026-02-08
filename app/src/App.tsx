import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Sections
import { Navigation } from './sections/Navigation';
import { HeroPremium } from './sections/HeroPremium';
import { RealKartExperience } from './sections/RealKartExperience';
import { Calendar } from './sections/Calendar';
import { News } from './sections/News';
import { Standings } from './sections/Standings';
import { Drivers } from './sections/Drivers';
import { Champions } from './sections/Champions';
import { Sponsors } from './sections/Sponsors';
import { Footer } from './sections/Footer';

// Components
import { CinematicIntro } from './components/CinematicIntro';
import { SectionTransition } from './components/SectionTransition';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Configure GSAP defaults
    gsap.config({
      nullTargetWarn: false,
    });

    // Set default ease for racing feel
    gsap.defaults({
      ease: 'power4.out',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Handle reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0);
      setIntroComplete(true);
    }

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black transition-colors duration-300">
      {/* Cinematic Intro */}
      {!introComplete && (
        <CinematicIntro 
          onComplete={() => setIntroComplete(true)}
          skipOnScroll={true}
        />
      )}

      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {/* Hero Section - Premium F1 Style */}
        <HeroPremium />
        
        {/* Transition */}
        <SectionTransition 
          type="diagonal" 
          fromColor="#000000" 
          toColor="#1a1a1a" 
        />

        {/* Real Kart Experience - Video with scroll control */}
        <RealKartExperience />

        {/* Transition */}
        <SectionTransition 
          type="wipe" 
          fromColor="#1a1a1a" 
          toColor="#0D0D0D" 
        />
        
        {/* Calendar / Stages Section */}
        <Calendar />

        {/* Transition */}
        <SectionTransition 
          type="fade" 
          fromColor="#0D0D0D" 
          toColor="#E10600" 
        />
        
        {/* News Section */}
        <News />

        {/* Transition */}
        <SectionTransition 
          type="diagonal" 
          fromColor="#E10600" 
          toColor="#1a1a1a" 
        />
        
        {/* Standings Section */}
        <Standings />

        {/* Transition */}
        <SectionTransition 
          type="curtain" 
          fromColor="#1a1a1a" 
          toColor="#001F3F" 
        />
        
        {/* Drivers Section */}
        <Drivers />

        {/* Transition */}
        <SectionTransition 
          type="wipe" 
          fromColor="#001F3F" 
          toColor="#0D0D0D" 
        />
        
        {/* Champions Gallery */}
        <Champions />

        {/* Transition */}
        <SectionTransition 
          type="fade" 
          fromColor="#0D0D0D" 
          toColor="#FFFFFF" 
        />
        
        {/* Sponsors Section */}
        <Sponsors />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
