import { type Transition } from "motion/react";
import { type Project } from "@/types/portfolio-types";

export const MY_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Curexal Space",
    category: "Healthcare Technology · Product Development",
    description:
      "A patient-centred healthcare platform connecting patients, clinicians, partner clinics, and diagnostic centres through a coordinated service.",
    subDescription: [
      "Contributing to product direction, system architecture, backend engineering, and healthcare workflow design.",
      "Developing connected care workflows spanning patient intake, consultations, referrals, diagnostics, and care coordination.",
      "Implementing resilient Go and PostgreSQL backend services built for diagnostic data integrity.",
      "Balancing patient and clinician user needs with healthcare operational realities.",
    ],
    href: "https://curexal.space",
    logo: "",
    image: "",
    accent: "from-mint/40 to-royal/10",
    tags: [
      { id: 1, name: "Go", path: "/assets/logos/javascript.svg" },
      { id: 2, name: "PostgreSQL", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "Next.js", path: "/assets/logos/react.svg" },
      { id: 4, name: "Digital Health", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 2,
    title: "Seat of Wisdom International",
    category: "Education Technology · School Management System",
    description:
      "Comprehensive school management system designed and developed to digitise and streamline school administrative and academic operations.",
    subDescription: [
      "Designed and developed a centralised system to digitise student records, academic tracking, and administration.",
      "Translated school operational challenges into intuitive software functionality and structured workflows.",
      "Simplified day-to-day administrative burdens for teachers, administrators, and parents.",
    ],
    href: "#",
    logo: "",
    image: "",
    accent: "from-aqua/40 to-royal/10",
    tags: [
      { id: 1, name: "TypeScript", path: "/assets/logos/javascript.svg" },
      { id: 2, name: "React", path: "/assets/logos/react.svg" },
      { id: 3, name: "SQL", path: "/assets/logos/javascript.svg" },
      { id: 4, name: "EdTech", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 3,
    title: "Inverex Global",
    category: "Renewable Energy · Collaborative Team Project",
    description:
      "Marketing and product web platform for a leading solar energy provider delivering clean power solutions globally.",
    subDescription: [
      "Contributed as part of the engineering team to build a responsive, SEO-optimised web experience.",
      "Developed modular UI components for product showcases and customer inquiries.",
    ],
    href: "https://www.inverexglobal.com/",
    logo: "",
    image: "/projects/inverex.webp",
    accent: "from-aqua/40 to-royal/10",
    tags: [
      { id: 1, name: "Next.js", path: "/assets/logos/react.svg" },
      { id: 2, name: "TypeScript", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "TailwindCSS", path: "/assets/logos/tailwindcss.svg" },
    ],
  },
  {
    id: 4,
    title: "Getweys",
    category: "Digital Agency · Collaborative Team Project",
    description:
      "Digital product platform showcasing agency offerings across web engineering, mobile development, and growth infrastructure.",
    subDescription: [
      "Assisted in structuring case-study portfolios spanning enterprise, healthcare, and fintech sectors.",
      "Optimised frontend performance and accessibility for international visitors.",
    ],
    href: "https://getweys.com/",
    logo: "",
    image: "/projects/getweys.webp",
    accent: "from-royal/40 to-lavender/10",
    tags: [
      { id: 1, name: "Next.js", path: "/assets/logos/react.svg" },
      { id: 2, name: "TypeScript", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "TailwindCSS", path: "/assets/logos/tailwindcss.svg" },
    ],
  },
  {
    id: 5,
    title: "PromptStore",
    category: "AI Marketplace · Collaborative Team Project",
    description:
      "Marketplace platform for discovering, listing, and purchasing tuned AI prompts for leading LLMs and generative systems.",
    subDescription: [
      "Supported category-based search indexing and checkout integrations.",
      "Delivered responsive catalog views optimized for fast browsing.",
    ],
    href: "https://promptstore.io/",
    logo: "",
    image: "",
    accent: "from-fuchsia/40 to-royal/10",
    tags: [
      { id: 1, name: "Next.js", path: "/assets/logos/react.svg" },
      { id: 2, name: "TypeScript", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "REST APIs", path: "/assets/logos/javascript.svg" },
    ],
  },
  {
    id: 6,
    title: "ClipSave",
    category: "Media Tools · Collaborative Team Project",
    description:
      "High-speed browser-based media utility supporting direct multi-source downloads with strict zero user-retention.",
    subDescription: [
      "Contributed to fast input resolution and parsing flows.",
      "Engineered lightweight client interactions for cross-device utility.",
    ],
    href: "https://clipsaves.com/",
    logo: "",
    image: "",
    accent: "from-sand/40 to-coral/10",
    tags: [
      { id: 1, name: "Next.js", path: "/assets/logos/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/logos/javascript.svg" },
      { id: 3, name: "TailwindCSS", path: "/assets/logos/tailwindcss.svg" },
    ],
  },
];

export const TILT_SPRING: Transition = { stiffness: 200, damping: 18 };

export const TILT_RANGE: { x: [number, number]; y: [number, number] } = {
  x: [10, -10],
  y: [-14, 14],
};

export const TRACK_SPRING: Transition = { stiffness: 60, damping: 20 };

export const PREVIEW_WINDOW = 1;

export const PREVIEW_TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};
