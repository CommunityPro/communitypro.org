"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const SENTENCE =
  "Membership here is earned, not bought. Sign in with GitHub, raise one pull request, and merge your way in.";
const ACCENTED = new Set(["earned,", "merge"]);

const Word = ({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);

  return (
    <motion.span className={accent ? "text-main" : undefined} style={{ opacity }}>
      {children}{" "}
    </motion.span>
  );
};

/**
 * Full-bleed dark statement panel. The sentence resolves word by word as the
 * reader scrolls through it (static under reduced motion). Deliberately dark in
 * both themes — it's the page's Spade-style interruption.
 *
 * @returns The statement section.
 * @example
 * <Statement />
 */
export const Statement = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  const words = SENTENCE.split(" ");

  return (
    <div className="mx-auto max-w-5xl px-4" ref={ref}>
      <p className="text-main/80 mb-10 font-mono text-xs tracking-[0.35em] uppercase">[ The rule ]</p>
      <p className="text-panel-foreground text-3xl leading-snug font-medium text-balance sm:text-6xl sm:leading-tight">
        {reducedMotion
          ? words.map((word) => (
              <span className={ACCENTED.has(word) ? "text-main" : undefined} key={word}>
                {word}{" "}
              </span>
            ))
          : words.map((word, index) => (
              <Word
                accent={ACCENTED.has(word)}
                key={`${word}-${index}`}
                progress={scrollYProgress}
                range={[index / words.length, (index + 1) / words.length]}
              >
                {word}
              </Word>
            ))}
      </p>
    </div>
  );
};
