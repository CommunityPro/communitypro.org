"use client";

import { motion, useReducedMotion } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Scroll-triggered entrance: children rise, sharpen and fade in the first time they
 * enter the viewport. Renders statically when the user prefers reduced motion.
 *
 * @param children - Content to reveal.
 * @param className - Classes forwarded to the wrapping motion.div.
 * @param delay - Seconds to hold back the transition (for staggering siblings).
 * @param y - Initial vertical offset in px (default 28).
 * @returns The reveal wrapper.
 * @example
 * <Reveal delay={0.1}><h2>Heading</h2></Reveal>
 */
export const Reveal = ({ children, className, delay = 0, y = 28 }: RevealProps) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
};
