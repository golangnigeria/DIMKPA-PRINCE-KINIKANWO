"use client";

import { type FC, type MouseEvent } from "react";
import Image from "next/image";
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
    <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950/30 transition-transform group-hover:scale-105">
      <Image
        src="/profile.webp"
        alt={HERO_NAME}
        width={32}
        height={32}
        className="h-full w-full object-cover"
      />
    </span>
    <span className="hidden sm:inline font-medium">{HERO_NAME}</span>
  </a>
);
