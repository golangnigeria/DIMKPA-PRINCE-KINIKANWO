"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { SPRING_SNAPPY } from "@/animations/ui-animations";
import { BUDGET_OPTIONS } from "@/constants/contact-constants";
import { type BudgetFieldProps } from "@/types/contact-types";

export const BudgetField: FC<BudgetFieldProps> = ({ value, onChange }) => (
  <div>
    <p className="mb-2.5 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
      Project budget (optional)
    </p>
    <div className="flex flex-wrap gap-2">
      {BUDGET_OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(active ? "" : option.value)}
            aria-pressed={active}
            className={`group relative rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              active
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 text-neutral-300 hover:border-emerald-500/30"
            }`}
          >
            {active && (
              <motion.span
                layoutId="budget-bg"
                transition={SPRING_SNAPPY}
                className="absolute inset-0 rounded-full bg-emerald-500/15"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
