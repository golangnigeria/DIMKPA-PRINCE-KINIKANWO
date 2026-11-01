"use client";

import { useEffect, useState, type FC } from "react";
import { HERO_NAME } from "@/constants/portfolio-constants";

const FIRST_LINE = HERO_NAME.split(" ");

const VISIBLE_MS = 900;
const SESSION_KEY = "intro-played";

export const PageLoader: FC = () => {
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        setRemoved(true);
        return;
      }

      setRemoved(true);
    }, VISIBLE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div className="page-loader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-primary">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[150px]" />
      </div>

      <div className="relative flex w-full max-w-2xl flex-col items-center px-6 text-center md:px-10">
        <div className="reveal-pop relative">
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-2xl font-bold text-emerald-400 shadow-sm md:h-16 md:w-16 md:text-3xl">
            {HERO_NAME.charAt(0)}
          </span>
        </div>

        <div className="mt-6 overflow-hidden md:mt-8">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white md:gap-3.5 md:text-4xl">
            {FIRST_LINE.map((word, i) => (
              <span
                key={word + i}
                className="reveal"
                style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <p
          className="reveal mt-2 text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:text-xs"
          style={{ animationDelay: "0.14s" }}
        >
          Software Engineer · IT Support · Business Strategist
        </p>

        <div
          className="reveal mt-8 w-full max-w-xs md:mt-10"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            <span>Loading</span>
            <span className="intro-count tabular-nums text-emerald-400 font-mono" />
          </div>
          <div className="relative h-[2px] w-full rounded-full bg-white/10">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="intro-fill absolute inset-0 bg-emerald-500" />
            </div>
            <div className="intro-knob absolute inset-0">
              <span className="absolute -top-1 left-0 -ml-1.5 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 mx-auto flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        <span>© {new Date().getFullYear()}</span>
        <span className="block h-px w-6 bg-white/15" />
        <span>{HERO_NAME}</span>
      </div>
    </div>
  );
};
