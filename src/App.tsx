import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { ProjectsSection } from "./components/ProjectsSection";
import { TechStackSection } from "./components/TechStackSection";
import { JourneyStop, ScrollJourney, TunnelTransition } from "./components/ScrollJourney";

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg">
      <ScrollJourney />
      <div className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay" />

      <Navbar />
      <main className="journey-content relative z-10">
        <JourneyStop>
          <HeroSection />
          <Marquee />
        </JourneyStop>
        <TunnelTransition index={0} />
        <JourneyStop>
          <AboutSection />
        </JourneyStop>
        <TunnelTransition index={1} />
        <JourneyStop>
          <ExperienceSection />
        </JourneyStop>
        <TunnelTransition index={2} />
        <JourneyStop>
          <ProjectsSection />
        </JourneyStop>
        <TunnelTransition index={3} />
        <JourneyStop>
          <TechStackSection />
        </JourneyStop>
        <TunnelTransition index={4} />
        <JourneyStop>
          <Footer />
        </JourneyStop>
      </main>
    </div>
  );
}
