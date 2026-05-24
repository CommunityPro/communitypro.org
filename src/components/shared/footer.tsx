"use client";

import Image from "next/image";
import Link from "next/link";

import { FOOTER_ROUTES } from "@/config/route";

const image = "/assets/images/community-pro.png";

export const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col">
        <div className="grid w-full grid-cols-3 gap-6 py-4">
          <div className="">
            <div className="relative aspect-square w-1/2">
              <Image alt="community-pro" className="object-cover" fill sizes="100%" src={image} />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FOOTER_ROUTES.map((section) => (
              <div className="flex flex-col gap-y-4" key={section.name}>
                <p className="text-lg font-semibold">{section.name}</p>
                <div className="flex flex-col gap-y-2">
                  {section.routes.map((route) => (
                    <Link className="link text-sm font-medium before:bg-white" href={route.href} key={route.href}>
                      {route.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-between py-2 text-sm">
          <p>&copy;{new Date().getFullYear()}. All rights reserved.</p>
          <p>Community Pro</p>
        </div>
      </div>
    </footer>
  );
};
