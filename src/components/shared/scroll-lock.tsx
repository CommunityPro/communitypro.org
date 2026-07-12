"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface Props {
  elements: React.JSX.Element[];
}

// Extra viewport-heights of scroll distance allotted to each transition between slides.
const SCROLL_PER_SLIDE = 80;

export const ScrollLock = ({ elements }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ offset: ["start start", "end end"], target: ref });

  return (
    <div
      className="relative w-full"
      ref={ref}
      style={{ height: `calc(100vh + ${(elements.length - 1) * SCROLL_PER_SLIDE}vh)` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-4 py-20">
        <div className="relative mx-auto w-full max-w-5xl" style={{ height: "clamp(320px, 45vh, 480px)" }}>
          {elements.map((element, index) => (
            <ScrollLockItem key={index} index={index} count={elements.length} progress={scrollYProgress}>
              {element}
            </ScrollLockItem>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ItemProps {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}

const ScrollLockItem = ({ index, count, progress, children }: ItemProps) => {
  // Each slide is centered on its own point in the scroll range and crossfades
  // with its neighbours over one step on either side.
  const step = count > 1 ? 1 / (count - 1) : 1;
  const center = index * step;

  const opacity = useTransform(progress, [center - step, center, center + step], [0, 1, 0]);
  const y = useTransform(progress, [center - step, center, center + step], [40, 0, -40]);

  return (
    <motion.div className="absolute inset-0 flex w-full items-center justify-center" style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};
