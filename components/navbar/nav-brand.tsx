"use client";

import { type FC, type MouseEvent } from "react";
import { HERO_NAME } from "@/constants/hero-constants";
import { goToAnchor } from "@/helpers/scroll-helpers";

export const NavBrand: FC = () => (
  <a
    href="#home"
    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      goToAnchor("#home");
    }}
    className="group flex items-center gap-2.5 text-base font-semibold tracking-tight text-white"
  >
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-sm font-bold text-emerald-400 transition-transform group-hover:scale-105">
      {HERO_NAME.charAt(0)}
    </span>
    <span className="hidden sm:inline font-medium">{HERO_NAME}</span>
  </a>
);
