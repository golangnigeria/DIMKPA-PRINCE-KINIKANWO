"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import { twMerge } from "tailwind-merge";
import { Marquee } from "@/components/portfolio/marquee";
import { REVIEWS } from "@/constants/portfolio-constants";
import { type Review } from "@/types/portfolio-types";

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const ReviewCard: FC<Review> = ({ name, role, body, accent }) => (
  <figure
    className={twMerge(
      "relative h-full w-80 cursor-default overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1217]/90 backdrop-blur-md p-6 transition-all hover:border-emerald-500/30 hover:-translate-y-1"
    )}
  >
    <div className="flex flex-row items-center gap-3">
      <div
        className={twMerge(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-emerald-200 border border-emerald-500/20 shadow-sm",
          accent
        )}
        aria-hidden
      >
        {initials(name)}
      </div>
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium text-neutral-400">{role}</p>
      </div>
    </div>
    <div
      className="mt-3.5 flex gap-1 text-emerald-400 text-xs"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
    <blockquote className="mt-3 text-sm text-neutral-300 leading-relaxed">
      &ldquo;{body}&rdquo;
    </blockquote>
  </figure>
);

export const Testimonial: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="testimonials"
      className="relative c-space section-spacing overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-[60%] rounded-full bg-emerald-500/[0.03] blur-[150px]" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-eyebrow"
      >
        Testimonials
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-heading mt-3 max-w-3xl"
      >
        What colleagues and partners{" "}
        <span className="text-emerald-400">say about working with me.</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative flex flex-col items-center justify-center w-full mt-12 overflow-hidden gap-4"
      >
        <Marquee pauseOnHover className="[--duration:36s] [--gap:1rem]">
          {firstRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="[--duration:42s] [--gap:1rem]"
        >
          {secondRow.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="absolute inset-y-0 left-0 w-1/5 pointer-events-none bg-gradient-to-r from-primary to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/5 pointer-events-none bg-gradient-to-l from-primary to-transparent" />
      </motion.div>
    </section>
  );
};
