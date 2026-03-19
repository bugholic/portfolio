import { motion } from "motion/react";
import { 
  Layers, 
  Code2, 
  Database, 
  Wind, 
  Box, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter,
  Terminal,
  Cpu,
  Globe
} from "lucide-react";

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-16 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-white/50 max-w-2xl mx-auto text-lg"
    >
      {subtitle}
    </motion.p>
  </div>
);

const TechCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
    className="p-8 rounded-2xl bg-card border border-border transition-colors group"
  >
    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-white/40 leading-relaxed">{description}</p>
  </motion.div>
);

const ProjectCard = ({ image, title, description, tags }: { image: string; title: string; description: string; tags: string[] }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="group cursor-pointer"
  >
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-white/5">
      <img 
        src={image} 
        alt={title} 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-white/50 mb-4 line-clamp-2">{description}</p>
    <div className="flex items-center text-accent font-medium group-hover:gap-2 transition-all">
      <span>View Project</span>
      <ArrowRight size={18} className="ml-1" />
    </div>
  </motion.div>
);

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none flex justify-around">
        <div className="grid-line left-[25%]" />
        <div className="grid-line left-[50%]" />
        <div className="grid-line left-[75%]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
        <div className="font-mono text-[10px] tracking-widest text-white/40">BH_OS v1.0</div>
        <div className="flex gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-white/60">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#stack" className="hover:text-white transition-colors">Stack</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
        </div>
        <div className="w-8 h-[1px] bg-accent" />
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12 relative"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 blur-3xl absolute inset-0 -z-10" />
          <div className="w-20 h-20 md:w-24 md:h-24 border border-accent/30 rounded-2xl flex items-center justify-center bg-bg/50 backdrop-blur-sm rotate-12">
             <Terminal className="text-accent" size={40} />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-[120px] font-bold tracking-[-0.04em] mb-8 text-center leading-none"
        >
          BUGHOLIC
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/40 max-w-xl text-center text-lg md:text-xl leading-relaxed mb-12"
        >
          Architecting robust full-stack solutions with <span className="text-accent italic">surgical precision</span> and minimalist design principles.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll to Explore</span>
        </motion.div>

        {/* Status Bar */}
        <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-center font-mono text-[9px] tracking-widest text-white/20 uppercase">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System: Nominal
            </span>
            <span>Latency: 14ms</span>
            <span className="hidden md:inline">Loc: 40.7128° N, 74.0060° W</span>
          </div>
          <div className="hidden md:block">© 2024 BUGHOLIC ENGINEERING</div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="stack" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeader 
          title="Tech Stack" 
          subtitle="A curated selection of technologies I use to build robust, scalable applications."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TechCard 
            icon={Layers} 
            title="Next.js" 
            description="High-performance React framework for the web with server-side rendering and static generation."
          />
          <TechCard 
            icon={Code2} 
            title="TypeScript" 
            description="Strongly typed JavaScript for better developer experience and more reliable codebases."
          />
          <TechCard 
            icon={Database} 
            title="Redis" 
            description="Lightning-fast in-memory data structure store for caching and real-time data processing."
          />
          <TechCard 
            icon={Cpu} 
            title="PostgreSQL" 
            description="Reliable and extensible relational database system for complex data modeling."
          />
          <TechCard 
            icon={Wind} 
            title="Tailwind CSS" 
            description="Utility-first CSS framework for rapid UI development and consistent design systems."
          />
          <TechCard 
            icon={Box} 
            title="Docker" 
            description="Consistent environments for building and shipping apps across any infrastructure."
          />
        </div>

        <div className="mt-16 flex justify-center">
          <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/60">Available for new projects</span>
          </div>
        </div>
      </section>

      {/* Selected Works Section */}
      <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
        <SectionHeader 
          title="Selected Works" 
          subtitle="A collection of high-end digital experiences, focusing on performance, aesthetics, and user-centric design."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <ProjectCard 
            image="https://picsum.photos/seed/dashboard/800/600"
            title="Lumina Dashboard"
            description="A high-performance analytics interface built with Next.js and TypeScript, featuring real-time data streaming."
            tags={["Next.js", "TypeScript"]}
          />
          <ProjectCard 
            image="https://picsum.photos/seed/mobile/800/600"
            title="Pulse Mobile"
            description="Cross-platform fitness tracking application developed using Expo and Reanimated for fluid interactions."
            tags={["React Native", "Expo"]}
          />
          <ProjectCard 
            image="https://picsum.photos/seed/saas/800/600"
            title="Vertex SaaS"
            description="A minimalist landing page optimized for conversion, built with Tailwind CSS and Framer Motion."
            tags={["React", "Tailwind"]}
          />
          <ProjectCard 
            image="https://picsum.photos/seed/crypto/800/600"
            title="Kryptos"
            description="Secure asset management platform utilizing React, PostgreSQL, and Supabase."
            tags={["Supabase", "React"]}
          />
          <ProjectCard 
            image="https://picsum.photos/seed/ai/800/600"
            title="Neural Studio"
            description="Interactive AI playground leveraging OpenAI API and Vercel Edge Functions."
            tags={["OpenAI", "Edge"]}
          />
          <ProjectCard 
            image="https://picsum.photos/seed/ui/800/600"
            title="Core UI"
            description="A comprehensive, accessible design system built for enterprise applications using Radix UI."
            tags={["Radix UI", "Accessibility"]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white/30 text-xs tracking-wider">
            © 2024 Developer Portfolio. All rights reserved.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
              <Github size={14} /> GitHub
            </a>
            <a href="#" className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href="#" className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
              <Twitter size={14} /> Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
