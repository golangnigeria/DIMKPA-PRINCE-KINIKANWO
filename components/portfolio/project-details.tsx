"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { type ProjectDetailsProps } from "@/types/portfolio-types";

export const ProjectDetails: FC<ProjectDetailsProps> = ({
  title,
  description,
  subDescription,
  tags,
  href,
  closeModal,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto p-4 backdrop-blur-md bg-black/70"
      onClick={closeModal}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl glass-strong border border-white/10"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button
          onClick={closeModal}
          aria-label="Close"
          className="absolute z-10 p-2 rounded-full top-4 right-4 bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <img src="/assets/close.svg" className="w-5 h-5" alt="" />
        </button>
        <div className="relative h-44 md:h-52 bg-gradient-to-b from-emerald-950/40 to-[#0c1217] overflow-hidden rounded-t-3xl border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.15),transparent_60%)]" />
          <div className="relative h-full w-full flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold text-white/15">
              {title.slice(0, 1)}
            </span>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h5 className="mb-2 text-2xl md:text-3xl font-bold text-white">
            {title}
          </h5>
          <p className="mb-5 text-neutral-400 text-sm md:text-base leading-relaxed">{description}</p>
          <ul className="space-y-3 mb-6">
            {subDescription.map((subDesc, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm text-neutral-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span>{subDesc}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            {href && href !== "#" && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-2 px-5 text-xs font-semibold"
              >
                <span>View Project</span>
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
