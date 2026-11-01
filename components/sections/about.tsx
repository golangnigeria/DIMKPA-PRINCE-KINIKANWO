"use client";

import { useRef, type FC } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AboutBio } from "@/components/about/about-bio";
import { AboutStatCard } from "@/components/about/about-stat-card";
import { SkillsMarquee } from "@/components/about/skills-marquee";
import { SectionHeader } from "@/components/ui/section-header";
import { STATS } from "@/constants/hero-constants";

export const About: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.1, 0.3, 0.1]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="c-space section-spacing relative overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ y: auroraY, opacity: auroraOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-emerald-500/[0.05] blur-[150px]" />
      </motion.div>

      <SectionHeader
        eyebrow="About"
        title={
          <>
            Engineering products that{" "}
            <span className="text-emerald-400">people actually use.</span>
          </>
        }
      />

      <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <AboutBio />
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {STATS.map((stat, index) => (
            <AboutStatCard key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>

      <SkillsMarquee />
    </section>
  );
};
