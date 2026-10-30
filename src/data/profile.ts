import type { CoverKey } from "../components/ProjectCover";

export const profile = {
  name: "Aayush Vishwakarma",
  role: "Senior Software Engineer",
  company: "Greenmint Labs",
  location: "Pune, India",
  email: "ayushv3930@gmail.com",
  cvUrl: "/Aayush-Vishwakarma-CV.pdf",
  photo: "/images/aayush-ghibli.webp",
  tagline: "Code to evolve, innovate to assist.",
  socials: {
    linkedin: "https://www.linkedin.com/in/ayuv",
    github: "https://github.com/bugholic",
    twitter: "https://x.com/vaayussh",
  },
};

export const experiences = [
  {
    role: "Senior Software Engineer",
    company: "Greenmint Labs",
    previously: "formerly Softwelve",
    employmentType: "Full-time",
    duration: "Apr 2025 — Present",
    location: "Pune, India",
    highlights: [
      "Lead delivery for client products: turn stakeholder requirements into specs and architecture, then plan, assign and review work for a team of 3–4.",
      "Built, in 10 days, an OAuth MCP server that lets Claude or ChatGPT build live Power-BI-style dashboards from 50+ Dynamics 365 tables in plain language.",
      "Designed a secure AI-to-D365 bridge on each user's delegated Entra token, so the AI acts only on allowlisted tables, within that user's own security role and with their confirmation.",
      "Shipped, in about 2 months, a bilingual multi-tenant intranet for ~100 staff with Entra SSO, Algolia search and ITSM ticketing with multi-step approvals.",
      "Sole author of an Odoo MCP server and WhatsApp assistant exposing 19 accounting, HR and timesheet tools, with role limits, audit logs and HR-approved writes.",
      "Built an Arabic/English RAG pipeline for a legal practice platform, with per-client data isolation, retrieval evaluation and cross-language fallback search.",
      "Use AI coding agents to ship ahead of estimates: an ERP AI assistant scoped at 3 weeks shipped in 8 days.",
    ],
    tags: ["Next.js", "TypeScript", "Python", "MCP", "Dynamics 365", "Azure Entra", "RAG", "Payload CMS"],
  },
  {
    role: "Digital Campaign Analyst",
    company: "Vellko Media",
    previously: null,
    employmentType: "Full-time",
    duration: "Jul 2024 — May 2025",
    location: "Bhopal, India",
    highlights: [
      "Built React frontends and websites for a digital marketing company.",
      "Automated analytics and reporting workflows, cutting reporting time from 3 hours to 30 minutes (about 83% less).",
      "Built an Ongage browser extension that replaced one-at-a-time rule deactivation with a single bulk-disable flow.",
    ],
    tags: ["React", "Automation", "Analytics", "Browser extension"],
  },
];

export const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    school: "Oriental Institute of Science and Technology",
    years: "2023 — 2025",
    location: "Bhopal",
    level: "Master's",
    scene: "university" as const,
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    school: "NRI Group of Institutions",
    years: "2020 — 2023",
    location: "Bhopal",
    level: "Bachelor's",
    scene: "college" as const,
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
    title: "AI Dashboard MCP Server",
    kind: "Client",
    summary:
      "An OAuth MCP server that lets Claude or ChatGPT build live Power-BI-style dashboards from 50+ Dynamics 365 tables, acting only with each user's own Entra role.",
    stack: ["MCP SDK", "Next.js", "Dynamics 365", "Azure Entra", "OAuth"],
    cover: "dashboard",
  },
  {
    title: "AI Legal Practice Platform",
    kind: "Client",
    summary:
      "Cases, clients, hearings, billing and a client portal, plus a tool-calling agent and an Arabic/English RAG pipeline that finds the exact passage.",
    stack: ["Next.js", "Convex", "RAG", "Clerk", "Docker"],
    cover: "law",
  },
  {
    title: "Odoo MCP & WhatsApp Assistant",
    kind: "Client",
    summary:
      "One service exposing 19 Odoo accounting, HR and timesheet tools to a ChatGPT connector and a Twilio WhatsApp bot, with role limits and HR-approved writes.",
    stack: ["Python", "MCP", "OAuth", "Twilio", "Docker"],
    cover: "odoo",
  },
  {
    title: "Lyrics Overlay",
    kind: "Personal",
    summary:
      "A Windows tray app that floats synced, karaoke-style lyrics over every window without taking focus. Ships as a single .exe.",
    stack: ["C#", ".NET", "Windows", "LRCLIB"],
    cover: "lyrics",
    repo: "https://github.com/bugholic/LyricsOverlay",
  },
  {
    title: "Agent Pipeline Monitor",
    kind: "Personal",
    summary: "A live view of Claude Code multi-agent pipelines, streamed from hook events over Server-Sent Events.",
    stack: ["Next.js", "React Flow", "SSE", "Claude Code"],
    cover: "pipeline",
  },
  {
    title: "Enterprise Intranet Portal",
    kind: "Client",
    summary:
      "A bilingual multi-tenant intranet for ~100 staff with Entra SSO, Algolia search and an ITSM module with multi-step approval workflows.",
    stack: ["Next.js", "Payload CMS", "Azure Entra", "Algolia"],
    cover: "itsm",
  },
  {
    title: "SyncPlay",
    kind: "Personal",
    summary: "Real-time music rooms with synced playback, a shared queue and chat.",
    stack: ["Next.js", "Socket.IO", "TypeScript"],
    cover: "syncplay",
    repo: "https://github.com/bugholic/syncPlay",
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
    title: "Scroll Face",
    kind: "Personal",
    summary: "Hands-free scrolling: a Python app that tracks your head and scrolls the screen as you tilt up or down.",
    stack: ["Python", "Computer vision"],
    cover: "scrollface",
    repo: "https://github.com/bugholic/scroll-face",
  },
];
