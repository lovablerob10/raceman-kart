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
import { Uniforms } from './sections/Uniforms';
import { MaintenanceRequests } from './sections/MaintenanceRequests';
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
          toColor="#050505"
        />

        {/* Real Kart Experience - Video with scroll control */}
        <RealKartExperience />

        {/* Transition */}
        <SectionTransition
          type="wipe"
          fromColor="#050505"
          toColor="#0D0D0D"
        />

        {/* Calendar / Stages Section */}
        <Calendar />

        {/* Transition */}
        <SectionTransition
          type="fade"
          fromColor="#0D0D0D"
          toColor="#0a0a0a"
        />

        {/* News Section */}
        <News />

        {/* Transition */}
        <SectionTransition
          type="diagonal"
          fromColor="#0a0a0a"
          toColor="#050505"
        />

        {/* Standings Section */}
        <Standings />

        {/* Transition */}
        <SectionTransition
          type="curtain"
          fromColor="#050505"
          toColor="#000214"
        />

        {/* Drivers Section */}
        <Drivers />

        {/* Transition */}
        <SectionTransition
          type="wipe"
          fromColor="#000214"
          toColor="#0a0a0f"
        />

        {/* Uniforms Section */}
        <Uniforms />

        {/* Transition */}
        <SectionTransition
          type="fade"
          fromColor="#0a0a0f"
          toColor="#0d0d12"
        />

        {/* Maintenance Requests Section */}
        <MaintenanceRequests />

        {/* Transition */}
        <SectionTransition
          type="wipe"
          fromColor="#0d0d12"
          toColor="#0D0D0D"
        />

        {/* Champions Gallery */}
        <Champions />

        {/* Transition */}
        <SectionTransition
          type="fade"
          fromColor="#0D0D0D"
          toColor="#0a0a0a"
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
