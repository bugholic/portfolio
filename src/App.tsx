import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { HorizontalScroll, Panel } from "./components/HorizontalScroll";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { ProjectsSection } from "./components/ProjectsSection";
import { SectionNumber } from "./components/SectionHeader";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { TechStackSection } from "./components/TechStackSection";
import { sectionOrder, type SectionKey } from "./data/sectionOrder";

const sections: Record<SectionKey, () => React.JSX.Element> = {
  about: AboutSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  stack: TechStackSection,
};

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg">
      <SpotlightCursor />
      <Navbar />
      <main className="relative z-10">
        <HorizontalScroll>
          <Panel>
            <HeroSection />
            <Marquee />
          </Panel>
          {sectionOrder.map((key, i) => {
            const Section = sections[key];
            return (
              <Panel key={key}>
                <SectionNumber.Provider value={i + 1}>
                  <Section />
                </SectionNumber.Provider>
              </Panel>
            );
          })}
          <Panel>
            <Footer />
          </Panel>
        </HorizontalScroll>
      </main>
    </div>
  );
}
