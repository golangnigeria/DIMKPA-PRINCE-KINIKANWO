"use client";

import { type FC } from "react";
import { Particles } from "@/components/portfolio/particles";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";

export const Contact: FC = () => {
  const [particlesRef, particlesInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="c-space section-spacing relative overflow-hidden"
    >
      <div ref={particlesRef} className="absolute inset-0 -z-10">
        {particlesInView && (
          <Particles
            className="absolute inset-0"
            quantity={90}
            ease={80}
            color="#34d399"
            refresh
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-10 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[150px]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <ContactDetails />
        <ContactForm />
      </div>
    </section>
  );
};
