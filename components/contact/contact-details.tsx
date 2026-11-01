"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { revealProps } from "@/animations/scroll-animations";
import {
  CONTACT_EMAIL,
  HERO_LOCATION,
} from "@/constants/portfolio-constants";
import { ContactInfoCard } from "./contact-info-card";

export const ContactDetails: FC = () => (
  <motion.div {...revealProps()} className="lg:col-span-5">
    <p className="text-eyebrow">Get In Touch</p>
    <h2 className="text-heading mt-3">
      Have a project or problem? <br />
      <span className="text-emerald-400">Let&apos;s solve it.</span>
    </h2>
    <p className="mt-4 leading-relaxed text-neutral-400">
      Whether you need software engineering, healthcare diagnostic workflow optimization,
      or strategic business technology planning, send a message and I&apos;ll respond promptly.
    </p>

    <div className="mt-8 space-y-3.5">
      <ContactInfoCard
        icon="✉"
        label="Email"
        value={CONTACT_EMAIL}
        href={`mailto:${CONTACT_EMAIL}`}
        gradient="from-emerald-950/60 to-emerald-900/40 text-emerald-300"
      />
      <ContactInfoCard
        icon="⌖"
        label="Location"
        value={`${HERO_LOCATION}`}
        gradient="from-emerald-950/60 to-emerald-900/40 text-emerald-300"
      />
      <ContactInfoCard
        icon="⏱"
        label="Response Time"
        value="Usually within 24 hours"
        gradient="from-emerald-950/60 to-emerald-900/40 text-emerald-300"
      />
    </div>
  </motion.div>
);
