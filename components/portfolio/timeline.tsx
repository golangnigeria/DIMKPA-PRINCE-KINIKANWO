"use client";

import { useEffect, useRef, useState, type FC } from "react";
import { useScroll, useTransform, motion, useInView } from "motion/react";
import { type Experience, type TimelineProps } from "@/types/portfolio-types";

const TimelineItem: FC<{ item: Experience; index: number }> = ({
  item,
  index,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const inView = useInView(itemRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      className="flex justify-start pt-10 md:pt-32 md:gap-10"
    >
      <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
        <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-[#080c10]">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.05 + 0.15 }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300 shadow-sm shadow-emerald-500/30"
          />
        </div>
        <div className="flex-col hidden gap-1.5 md:flex md:pl-20">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">{item.date}</span>
          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
          <h4 className="text-sm font-medium text-neutral-400">{item.job}</h4>
        </div>
      </div>
      <div className="relative w-full pl-20 pr-4 md:pl-4">
        <div className="block mb-4 text-left md:hidden">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 mb-1 block">{item.date}</span>
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <h4 className="text-sm text-neutral-400">{item.job}</h4>
        </div>
        <div className="space-y-3">
          {item.contents.map((content, contentIndex) => (
            <motion.p
              key={contentIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.05 + 0.2 + contentIndex * 0.06,
              }}
              className="text-sm leading-relaxed text-neutral-300 flex gap-3"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400/80 flex-shrink-0" />
              <span>{content}</span>
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const Timeline: FC<TimelineProps> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      id="experience"
      className="c-space section-spacing relative overflow-hidden"
      ref={containerRef}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.03] blur-[150px]" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-eyebrow"
      >
        Experience
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-heading mt-3 max-w-3xl"
      >
        Career trajectory focused on <span className="text-emerald-400">technical execution &amp; reliability.</span>
      </motion.h2>

      <div ref={ref} className="relative pb-20 mt-8">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-emerald-500 via-emerald-400/40 to-transparent from-[0%] via-[15%] rounded-full"
          />
        </div>
      </div>
    </section>
  );
};
