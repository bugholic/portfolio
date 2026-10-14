import type { CoverKey } from "../components/ProjectCover";

export const profile = {
  name: "Aayush Vishwakarma",
  role: "Full Stack Developer",
  company: "Greenmint Labs",
  location: "Pune, India",
  email: "ayushv2001@gmail.com",
  cvUrl: "/Aayush-Vishwakarma-CV.pdf",
  photo: "/images/aayush.jpg",
  tagline: "Code to evolve, innovate to assist.",
  socials: {
    linkedin: "https://www.linkedin.com/in/ayuv",
    github: "https://github.com/bugholic",
    twitter: "https://x.com/vaayussh",
  },
};

export const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Greenmint Labs",
    previously: "formerly Softwelve",
    employmentType: "Full-time",
    duration: "Apr 2025 — Present",
    location: "Pune, India",
    highlights: [
      "Built a cross-platform mobile app with Expo, cutting development time by 40% through AI-assisted workflows.",
      "Developed a role-based ITSM platform with Microsoft authentication, ticketing and workflow automation.",
      "Moved data fetching to scheduled cron jobs, taking page loads from 10–15s down to 2–3s.",
      "Architected a D365 application-approval system using D365 MCP and APIs.",
    ],
    tags: ["Next.js", "Expo", "Node.js", "Python", "D365", "MCP"],
  },
  {
    role: "React Developer",
    company: "Vellko Media",
    previously: null,
    employmentType: "Full-time",
    duration: "Jul 2023 — May 2025",
    location: "Bhopal, India",
    highlights: [
      "Built and maintained apps from reusable React function components, reducing duplicate code by 40%.",
      "Used React Hooks to implement complex functionality with a maintainable component architecture.",
    ],
    tags: ["React", "Hooks", "Component Architecture"],
  },
];

export const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    school: "Oriental Institute of Science and Technology",
    years: "2023 — 2025",
    location: "Bhopal",
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "NRI Group of Institutions",
    years: "2020 — 2023",
    location: "Bhopal",
  },
];

export type Project = {
  title: string;
  kind: "Client" | "Personal";
  summary: string;
  stack: string[];
  cover: CoverKey;
  repo?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Lyrics Overlay",
    kind: "Personal",
    summary:
      "A Windows tray app that floats synced, karaoke-style lyrics over everything for whatever is playing in your browser. Click-through, never steals focus.",
    stack: ["C#", "Windows", "Browser extension", "LRCLIB"],
    cover: "lyrics",
    repo: "https://github.com/bugholic/LyricsOverlay",
  },
  {
    title: "AI Inventory Management",
    kind: "Client",
    summary:
      "An LLM pipeline that parses seller catalogs and syncs products into Qoyod, with a harness layer around OpenRouter to cut hallucinations.",
    stack: ["Python", "Next.js", "OpenRouter", "RAG", "GCP", "YOLO"],
    cover: "inventory",
  },
  {
    title: "FlowBoard",
    kind: "Personal",
    summary:
      "A full-stack project-management SaaS with auth, projects, tasks and notifications, plus Socket.io live updates and rendering tuned for frequent changes.",
    stack: ["Next.js", "TypeScript", "Zustand", "MongoDB", "Socket.io"],
    cover: "flowboard",
    repo: "https://github.com/bugholic/Flowboard-AI",
  },
  {
    title: "AI Law Case Analysis",
    kind: "Client",
    summary:
      "A SaaS for law firms that automates case-ruling and opposition analysis, with semantic search across their case data.",
    stack: ["Next.js", "Python", "Qdrant", "Convex", "Redis", "Clerk"],
    cover: "law",
  },
  {
    title: "Foodox",
    kind: "Personal",
    summary:
      "Order management for local shops: customers, real-time ordering, notifications and a chatbot assistant. Deployed on AWS EC2 + S3 with GitHub Actions CI/CD.",
    stack: ["Next.js", "TypeScript", "Redis", "Convex", "Clerk", "AWS"],
    cover: "foodox",
  },
  {
    title: "Service Management Platform",
    kind: "Client",
    summary:
      "A role-aware ITSM platform with Microsoft sign-in, ticketing, approvals, workflow automation and an AI-enabled request dashboard.",
    stack: ["Next.js", "Payload CMS", "MongoDB", "Microsoft 365"],
    cover: "itsm",
  },
  {
    title: "SyncPlay",
    kind: "Personal",
    summary: "A music platform where multiple people listen to the same track together, perfectly in sync.",
    stack: ["TypeScript", "Real-time"],
    cover: "syncplay",
    repo: "https://github.com/bugholic/syncPlay",
  },
  {
    title: "Scroll Face",
    kind: "Personal",
    summary: "Hands-free scrolling: a Python app that tracks your head and scrolls the screen as you tilt up or down.",
    stack: ["Python", "Computer vision"],
    cover: "scrollface",
    repo: "https://github.com/bugholic/scroll-face",
  },
];

export const skillGroups = [
  { label: "Languages", value: "JavaScript, TypeScript, Python" },
  { label: "Frontend", value: "React, Next.js, Expo" },
  { label: "Backend", value: "Node.js, Express, REST APIs" },
  { label: "Data", value: "MongoDB, PostgreSQL, SQLite, Convex, Qdrant, Redis" },
  { label: "AI & DevOps", value: "RAG, LLMs, MCP, AI agents, Docker, GitHub Actions" },
  { label: "Cloud", value: "GCP, AWS (EC2, S3)" },
];
