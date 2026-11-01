"use client";

import { useRef, type FC } from "react";
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
      <p className="mb-3 text-xs md:text-sm uppercase tracking-[0.25em] text-emerald-400 font-semibold">
        Professional Background
      </p>
      <h3 className="mb-4 text-2xl font-bold md:text-3xl">
        {HERO_NAME} · {HERO_LOCATION}
      </h3>
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
