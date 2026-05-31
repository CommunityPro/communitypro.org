"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { AVATARS, METRICS, SPONSORS } from "@/constants";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="w-screen">
      <section className="h-screen w-full sm:py-20">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-2">
          <div className="flex flex-col justify-center gap-y-5">
            <div className="flex items-center gap-x-4">
              <AvatarGroup>
                {AVATARS.map((avatar) => (
                  <Avatar className="size-6" key={avatar.id}>
                    <AvatarImage src={avatar.image} />
                  </Avatar>
                ))}
              </AvatarGroup>
              <p className="text-xs text-gray-400">
                <span className="text-foreground font-semibold">500+</span> pros already inside — from Figma, Stripe,
                Linear, Vercel & over 15 indie studios
              </p>
            </div>
            <p className="text-4xl font-bold sm:text-8xl"></p>
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
                <Link href="/join-community">Join Community</Link>
              </Button>
            </div>
          </div>
          <div className=""></div>
        </div>
      </section>
      <section className="w-full overflow-hidden border-y py-4">
        <div className="mx-auto max-w-7xl overflow-x-hidden">
          <motion.div
            className="flex w-max items-center gap-x-40"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {[...SPONSORS, ...SPONSORS].map((sponsor, i) => (
              <div className="relative aspect-square w-7 shrink-0" key={`${sponsor.id}-${i}`}>
                <Image alt={sponsor.name} className="object-cover" fill sizes="28px" src={sponsor.image} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="w-full py-10 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-4">
          {METRICS.map((metric) => (
            <div className="gap-y-y4 flex flex-col items-center text-center" key={metric.id}>
              <p className="text-5xl font-bold">{metric.value}</p>
              <p className="font-medium">{metric.label}</p>
              <p className="text-sm text-gray-400">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>
      <hr />
      <section className="py-5 sm:py-10"></section>
      <section className="py-5 sm:py-10"></section>
      <section className="bg-main relative flex min-h-100 items-center justify-center py-10 text-black sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <p className="w-full text-center text-6xl font-semibold sm:w-2/3">
            Stop scrolling. Start <span className="italic">shipping</span> with people.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;
