"use client";

import { useEffect, useState } from "react";

import { LOADING_VERBS } from "@/constants";
import { cn } from "@/lib";

interface Props {
  className?: string;
}

export const Loader = ({ className }: Props) => {
  const [verb, setVerb] = useState(LOADING_VERBS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = LOADING_VERBS.indexOf(verb);
      setVerb(LOADING_VERBS[(currentIndex + 1) % LOADING_VERBS.length]);
    }, 1000);
    return () => clearInterval(interval);
  }, [verb]);

  return (
    <div className={cn("z-50! grid h-screen w-screen place-items-center", className)}>
      <div className="flex flex-col items-center gap-y-10">
        <p className="text-main text-sm font-semibold">{verb}</p>
      </div>
    </div>
  );
};
