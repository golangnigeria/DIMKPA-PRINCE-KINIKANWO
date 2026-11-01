import { type FC } from "react";
import { type StatCardProps } from "@/types/admin-types";

export const StatCard: FC<StatCardProps> = ({ label, value }) => (
  <div className="glass p-5 border border-white/10 hover:border-emerald-500/30 transition-colors">
    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">{label}</p>
    <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">{value}</p>
  </div>
);
