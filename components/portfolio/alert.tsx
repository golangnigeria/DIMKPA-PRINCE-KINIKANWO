"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { type AlertProps } from "@/types/portfolio-types";

const alertVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.8 },
};

export const Alert: FC<AlertProps> = ({ type, text }) => {
  const isDanger = type === "danger";

  return (
    <motion.div
      className="fixed z-50 flex items-center justify-center bottom-5 right-5"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={alertVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className={`p-2 ${
          isDanger ? "bg-red-950 border border-red-500/40 text-red-200" : "bg-emerald-950 border border-emerald-500/40 text-emerald-100"
        } items-center leading-none lg:rounded-full flex lg:inline-flex rounded-xl p-4 shadow-xl`}
      >
        <p
          className={`flex rounded-full ${
            isDanger ? "bg-red-500 text-white" : "bg-emerald-500 text-neutral-950"
          } uppercase px-2.5 py-1 text-xs font-bold mr-3`}
        >
          {isDanger ? "Failed" : "Success"}
        </p>
        <p className="mr-2 text-sm text-left">{text}</p>
      </div>
    </motion.div>
  );
};
