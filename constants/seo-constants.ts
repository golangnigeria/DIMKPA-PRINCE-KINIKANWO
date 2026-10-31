import { HERO_LOCATION, HERO_NAME, HERO_ROLE } from "./hero-constants";
import { CONTACT_EMAIL, MY_SOCIALS } from "./social-constants";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dimkpa-prince.vercel.app"
).replace(/\/$/, "");

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = `${HERO_NAME} | ${HERO_ROLE}`;

export const SITE_TITLE = `${HERO_NAME} | ${HERO_ROLE}`;

export const SITE_DESCRIPTION =
  "Software Engineer, IT Support Officer, and Business Strategist with a multidisciplinary background in Microbiology, healthcare technology, and business operations.";

export const SITE_TAGLINE =
  "Translating operational challenges into useful technology solutions.";

export const OG_IMAGE = "/og.jpg";
export const OG_IMAGE_ALT = `${HERO_NAME}, ${HERO_ROLE} portfolio`;
export const OG_LOCALE = "en_US";

export const OG_IMAGES = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: OG_IMAGE_ALT,
  },
];

export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

export const SITE_KEYWORDS = [
  HERO_NAME,
  "Software Engineer",
  "IT Support Officer",
  "Business Strategist",
  "Go Developer",
  "Golang Nigeria",
  "Everight Diagnostic",
  "Curexal Space",
  "Seat of Wisdom International",
  "Owerri Nigeria",
  "Rivers State University",
  "Microbiology",
  "Digital Health Technology",
  "Diagnostic Laboratory IT",
  "ISO 15189:2022",
  "PostgreSQL",
  "Next.js Developer",
  HERO_LOCATION,
];

export const HOME_TITLE = `${HERO_NAME} | Software Engineer, IT Support & Business Strategist`;

export const HOME_DESCRIPTION =
  "Portfolio of Prince Dimkpa — Software Engineer, IT Support Officer at Everight Diagnostic & Laboratory Services, and Lead Developer at Curexal Space. Expertise across Go, TypeScript, PostgreSQL, digital healthcare, education technology, and business strategy.";

export const ADMIN_TITLE = "Contact submissions";

export const ADMIN_DESCRIPTION =
  "Private dashboard for contact form submissions. Not part of the public site.";

export const ADMIN_LOGIN_TITLE = "Sign in";

export const ADMIN_LOGIN_DESCRIPTION =
  "Sign in to the private contact submissions dashboard.";

export const SITE_SECTIONS = [
  {
    name: "Home",
    hash: "#home",
    description: `${HERO_NAME}, ${HERO_ROLE}.`,
  },
  {
    name: "About",
    hash: "#about",
    description: `Background, education in Microbiology, technical skills and work philosophy of ${HERO_NAME}, based in ${HERO_LOCATION}.`,
  },
  {
    name: "Services",
    hash: "#services",
    description:
      "Software engineering, healthcare technology, IT support operations, and business strategy consulting.",
  },
  {
    name: "Work",
    hash: "#work",
    description:
      "Featured projects including Curexal Space, Seat of Wisdom International, and collaborative web platforms.",
  },
  {
    name: "Testimonials",
    hash: "#testimonials",
    description: `What colleagues and partners say about working with ${HERO_NAME}.`,
  },
  {
    name: "Contact",
    hash: "#contact",
    description: `Contact ${HERO_NAME} for software development, IT operations, or business consulting at ${CONTACT_EMAIL}.`,
  },
];

export const JSON_LD_SAME_AS = MY_SOCIALS.map((social) => social.href);
export const SOCIAL_PROFILES = MY_SOCIALS.map((social) => social.href);
export const CONTACT_POINT_EMAIL = CONTACT_EMAIL;
