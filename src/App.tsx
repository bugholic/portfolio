import { AboutSection } from "./components/AboutSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ProjectsSection } from "./components/ProjectsSection";
import { TechStackSection } from "./components/TechStackSection";

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_32%),radial-gradient(circle_at_20%_30%,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#04060f_0%,#060914_40%,#03040a_100%)]" />
        <div className="absolute inset-0 flex justify-around">
          <div className="grid-line left-[25%]" />
          <div className="grid-line left-[50%]" />
          <div className="grid-line left-[75%]" />
        </div>
        <div className="noise-overlay absolute inset-0 opacity-40" />
      </div>

      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <TechStackSection />
      <ProjectsSection />
      <Footer />
    </div>
  );
}
