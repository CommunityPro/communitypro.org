"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePostHog } from "@posthog/react";
import { useEffect, useRef } from "react";
import Link from "next/link";

import { Avatar, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AVATARS, METRICS } from "@/constants";
import { MembersSpotlightSection } from "@/features/members";

const Page = () => {
  const posthong = usePostHog();

  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const dx = (e.clientX - (left + width / 2)) / (width / 2);
    const dy = (e.clientY - (top + height / 2)) / (height / 2);
    rotateY.set(dx * 35);
    rotateX.set(-dy * 35);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  useEffect(() => {
    posthong.capture("page_view");
  }, [posthong]);

  return (
    <div className="w-screen">
      <section
        className="h-screen w-full sm:py-20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ref}
        style={{ perspective: "600px" }}
      >
        <div className="mx-auto grid h-full max-w-7xl grid-cols-2 gap-6">
          <div className="flex flex-col justify-center gap-y-5">
            <div className="flex w-full items-center gap-x-4">
              <AvatarGroup>
                {AVATARS.map((avatar) => (
                  <Avatar className="size-6" key={avatar.id}>
                    <AvatarImage src={avatar.image} />
                  </Avatar>
                ))}
              </AvatarGroup>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-black dark:text-white">500+</span> pros already inside — from over
                50 companies & indie studios
              </p>
            </div>
            <h1 className="text-4xl font-medium sm:text-8xl">Where pros actually hang out.</h1>
            <p className="text-sm text-gray-400">
              A members-only community for designers, engineers and builders shipping real things. No gurus, no generic
              threads — just your people, a portfolio that doesn&apos;t suck, and the events you actually want to go
              attend.
            </p>
            <div className="flex items-center gap-x-4">
              <Button asChild size="xl">
                <Link href="/join-community">Join Community</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/sponsors">Become a Sponsor</Link>
              </Button>
            </div>
          </div>
          <div className="grid place-items-center" style={{ perspective: "600px" }}>
            <motion.div
              className="bg-main flex size-40 flex-col items-center justify-center gap-y-4 py-6"
              style={{ rotateX: springX, rotateY: springY }}
            ></motion.div>
          </div>
        </div>
      </section>
      <section className="w-full py-10 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-4">
          {METRICS.map((metric) => (
            <div className="gap-y-y4 flex flex-col items-center text-center" key={metric.id}>
              <h4 className="text-5xl font-medium">{metric.value}+</h4>
              <p className="font-medium">{metric.label}</p>
              <p className="text-sm text-gray-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>
      <hr />
      <section className="py-5 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-4">
          <MembersSpotlightSection />
        </div>
      </section>
      <section className="py-5 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-4"></div>
      </section>
      <section className="py-5 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-4"></div>
      </section>
      <section className="bg-main relative flex min-h-100 items-center justify-center py-10 text-black sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <h2 className="w-full text-center text-6xl font-medium sm:w-2/3">
            Stop scrolling. Start <span className="italic">shipping</span> with people.
          </h2>
        </div>
      </section>
      <section className="py-5 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center"></div>
      </section>
    </div>
  );
};

export default Page;
