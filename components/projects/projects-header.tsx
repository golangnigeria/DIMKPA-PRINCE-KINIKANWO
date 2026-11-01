import { type FC } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { padIndex } from "@/helpers/format-helpers";

export const ProjectsHeader: FC<{ total: number }> = ({ total }) => (
  <div className="c-space pt-24 md:pt-32">
    <SectionHeader
      eyebrow={`Selected Work · ${padIndex(total)}`}
      title={
        <>
          Projects that{" "}
          <span className="text-emerald-400">engineered &amp; delivered.</span>
        </>
      }
      hint={["Scroll", "Pinned"]}
    />
  </div>
);
