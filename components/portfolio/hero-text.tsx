"use client";

import { type CSSProperties, type FC } from "react";
import { FlipWords } from "@/components/portfolio/flip-words";
import {
  FLIP_WORDS,
  HERO_NAME,
  HERO_ROLE,
  RESUME_URL,
} from "@/constants/portfolio-constants";

const delay = (seconds: number): CSSProperties => ({
  animationDelay: `calc(var(--intro-delay) + ${seconds}s)`,
});

export const HeroText: FC = () => {
  return (
    <div className="z-10 mt-24 text-center md:mt-32 md:text-left max-w-3xl">
      <div className="flex-col hidden md:flex c-space">
        <div
          className="reveal inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md px-3 py-1.5 mb-6"
          style={delay(0.05)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-mint animate-ping opacity-75" />
            <span className="relative rounded-full bg-mint h-2 w-2" />
          </span>
          <span className="text-xs tracking-[0.25em] uppercase text-neutral-300">
            Available for new opportunities &amp; projects
          </span>
        </div>

        <h1
          className="reveal text-3xl font-light text-neutral-400"
          style={delay(0.12)}
        >
          Hi, I&apos;m {HERO_NAME}
        </h1>

        <p
          className="reveal text-4xl lg:text-5xl font-bold mt-2 text-gradient leading-tight"
          style={delay(0.19)}
        >
          {HERO_ROLE} <br />
          engineering
        </p>

        <div className="reveal" style={delay(0.26)}>
          <FlipWords
            words={[...FLIP_WORDS]}
            className="font-black text-white text-6xl lg:text-7xl"
          />
        </div>

        <p
          className="reveal text-2xl lg:text-3xl font-semibold text-neutral-300"
          style={delay(0.33)}
        >
          technology &amp; business solutions.
        </p>

        <div className="reveal flex flex-wrap gap-4 mt-10" style={delay(0.4)}>
          <a href="#contact" className="btn-primary">
            <span>Get In Touch</span>
            <span aria-hidden>→</span>
          </a>
          <a href="#work" className="btn-ghost">
            <span>View Projects</span>
          </a>
          <a href={RESUME_URL} download="Dimkpa-Prince-Resume.pdf" className="btn-ghost">
            <span>Download CV</span>
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>

      <div className="flex flex-col space-y-5 md:hidden px-2">
        <div
          className="reveal inline-flex self-center items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5"
          style={delay(0.05)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-mint animate-ping opacity-75" />
            <span className="relative rounded-full bg-mint h-2 w-2" />
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300">
            Available for Projects
          </span>
        </div>

        <p
          className="reveal text-3xl font-light text-neutral-400"
          style={delay(0.12)}
        >
          Hi, I&apos;m {HERO_NAME}
        </p>

        <p
          className="reveal text-3xl font-bold text-gradient"
          style={delay(0.19)}
        >
          {HERO_ROLE}
        </p>

        <div className="reveal" style={delay(0.26)}>
          <FlipWords
            words={[...FLIP_WORDS]}
            className="font-bold text-white text-4xl"
          />
        </div>

        <p
          className="reveal text-2xl font-semibold text-neutral-300"
          style={delay(0.33)}
        >
          technology &amp; business solutions.
        </p>

        <div
          className="reveal flex flex-col gap-3 mt-4 items-center"
          style={delay(0.4)}
        >
          <a href="#contact" className="btn-primary w-full">
            <span>Get In Touch</span>
            <span aria-hidden>→</span>
          </a>
          <a href="#work" className="btn-ghost w-full">
            <span>View Projects</span>
          </a>
          <a href={RESUME_URL} download="Dimkpa-Prince-Resume.pdf" className="btn-ghost w-full">
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </div>
  );
};
