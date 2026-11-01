import { type Service } from "@/types/portfolio-types";

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Software Engineering",
    description:
      "Full-stack and backend software development built with Go, JavaScript, TypeScript, PostgreSQL, and modern web frameworks.",
    icon: "/assets/logos/react.svg",
    bullets: [
      "Backend engineering with Go & PostgreSQL",
      "Interactive web apps with React & Next.js",
      "Robust RESTful APIs & database modeling",
    ],
  },
  {
    id: 2,
    title: "Healthcare Technology",
    description:
      "Designing connected care and diagnostic workflows that streamline communication between patients, clinicians, and laboratories.",
    icon: "/assets/logos/javascript.svg",
    bullets: [
      "Patient intake & consultation workflows",
      "Diagnostic referral & reporting systems",
      "Healthcare data integrity & privacy",
    ],
  },
  {
    id: 3,
    title: "IT Support & Systems Operations",
    description:
      "Reliable IT infrastructure support, hardware/software troubleshooting, and operational continuity in clinical environments.",
    icon: "/assets/logos/tailwindcss.svg",
    bullets: [
      "Diagnostic laboratory IT operations",
      "ISO 15189:2022 compliance awareness",
      "Hardware, software & network troubleshooting",
    ],
  },
  {
    id: 4,
    title: "Business Strategy & Product Planning",
    description:
      "Bridging operational realities with technical solutions to prioritize high-value features and drive digital transformation.",
    icon: "/assets/logos/javascript.svg",
    bullets: [
      "Operational workflow & friction analysis",
      "Product roadmap & feature prioritization",
      "Digital transformation for healthcare & enterprise workflows",
    ],
  },
];
