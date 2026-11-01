import { type FC } from "react";
import { type ContactInfoCardProps } from "@/types/contact-types";

export const ContactInfoCard: FC<ContactInfoCardProps> = ({
  icon,
  label,
  value,
  href,
  gradient,
}) => {
  const body = (
    <>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 text-base ${gradient}`}
      >
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
          {label}
        </p>
        <p
          className={`truncate text-sm text-neutral-200 ${
            href ? "transition-colors group-hover:text-emerald-400" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  const className = "glass gradient-border flex items-center gap-4 p-4 hover:border-emerald-500/30 transition-colors";

  return href ? (
    <a
      href={href}
      className={`${className} group transition-colors hover:bg-white/[0.04]`}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
};
