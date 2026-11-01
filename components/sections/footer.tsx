"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import {
  CONTACT_EMAIL,
  HERO_NAME,
  MY_SOCIALS,
} from "@/constants/portfolio-constants";

export const Footer: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer ref={ref} className="c-space pt-16 pb-8 relative overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="bg-neutral-800 h-px w-full"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-50%] h-72 w-[80%] rounded-full bg-emerald-500/[0.02] blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
      >
        <div>
          <div className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
            <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950/30">
              <Image
                src="/profile.webp"
                alt={HERO_NAME}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-medium">{HERO_NAME}</span>
          </div>
          <p className="mt-2.5 text-sm text-neutral-400 max-w-sm">
            Translating operational challenges into resilient technology solutions. Contact at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-neutral-200 hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3.5">
          <div className="flex gap-2.5">
            {MY_SOCIALS.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors"
              >
                <img src={social.icon} alt="" loading="lazy" decoding="async" className="w-4 h-4 opacity-80 hover:opacity-100" />
              </motion.a>
            ))}
          </div>
          <div className="flex gap-2.5 text-xs text-neutral-500">
            <span>
              © {new Date().getFullYear()} {HERO_NAME}
            </span>
            <span>·</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 text-center text-[16vw] md:text-[11rem] font-bold leading-none text-white/[0.02] select-none uppercase tracking-tight"
      >
        {HERO_NAME.split(" ")[0]}
      </motion.p>
    </footer>
  );
};
