import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HorizontalScroll, Panel } from "./components/HorizontalScroll";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { ProjectsSection } from "./components/ProjectsSection";
import { TechStackSection } from "./components/TechStackSection";

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />
      <main className="relative z-10">
        <HorizontalScroll>
          <Panel>
            <HeroSection />
            <Marquee />
          </Panel>
          <Panel>
            <AboutSection />
          </Panel>
          <Panel>
            <ExperienceSection />
          </Panel>
          <Panel>
            <ProjectsSection />
          </Panel>
          <Panel>
            <TechStackSection />
          </Panel>
          <Panel>
            <Footer />
          </Panel>
        </HorizontalScroll>
      </main>
    </div>
  );
}
