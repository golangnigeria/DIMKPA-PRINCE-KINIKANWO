"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { fadeInUp } from "@/animations/scroll-animations";
import { HERO_LOCATION, HERO_NAME } from "@/constants/hero-constants";
import { RESUME_URL } from "@/constants/social-constants";

export const AboutBio: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7 }}
      className="glass gradient-border p-8 md:p-10 lg:col-span-7"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6 pb-6 border-b border-white/10">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-midnight shadow-lg shadow-emerald-950/50">
          <Image
            src="/profile.webp"
            alt={HERO_NAME}
            width={80}
            height={80}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">
            Professional Background
          </p>
          <h3 className="text-2xl font-bold md:text-3xl text-white">
            {HERO_NAME}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">{HERO_LOCATION}</p>
        </div>
      </div>

      <p className="text-base leading-relaxed text-neutral-300 md:text-lg">
        I am a <span className="font-semibold text-white">Software Engineer, IT Support Officer, and Business Strategist</span> with
        a multidisciplinary background in <span className="text-white">Microbiology (B.Sc., Rivers State University)</span>,
        software development, healthcare technology, and business operations.
      </p>
      <p className="mt-4 leading-relaxed text-neutral-400">
        Currently supporting mission-critical diagnostic technology operations at{" "}
        <span className="text-white">Everight Diagnostic and Laboratory Services</span> aligned with{" "}
        <span className="text-white">ISO 15189:2022</span> quality management standards, while driving product direction and backend
        engineering for <span className="text-white">Curexal Space</span>. I bring together technical problem-solving, analytical thinking,
        and business strategy to translate operational challenges into practical, resilient technology solutions.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#contact" className="btn-primary">
          <span>Get in touch</span>
          <span aria-hidden>→</span>
        </a>
        <a href={RESUME_URL} download="Prince-Dimkpa-Resume.pdf" className="btn-ghost">
          <span>Download Resume</span>
          <span aria-hidden>↓</span>
        </a>
      </div>
    </motion.div>
  );
};
