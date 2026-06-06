"use client";

import Image from "next/image";
import Link from "next/link";

import { FOOTER_ROUTES } from "@/config/route";

const image = "/assets/images/community-pro.png";

export const Footer = () => {
  return (
    <footer className="w-full bg-black py-5 text-white">
      <div className="mx-auto flex max-w-7xl flex-col">
        <div className="grid w-full grid-cols-3 gap-6 py-6">
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2">
              <div className="relative aspect-square w-8">
                <Image alt="community-pro" className="object-cover" fill sizes="100%" src={image} />
              </div>
              <p className="text-4xl font-medium">Community Pro</p>
            </div>
            <p className="text-sm text-gray-400">
              Connect with us on social media to stay updated on the latest news and events.
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FOOTER_ROUTES.map((section) => (
              <div className="flex flex-col gap-y-4" key={section.name}>
                <p className="font-medium text-gray-400 uppercase">{section.name}</p>
                <div className="flex flex-col gap-y-2">
                  {section.routes.map((route) => (
                    <Link
                      className="link text-sm font-medium before:bg-white"
                      href={route.href}
                      key={route.href}
                      rel={route.target === "_blank" ? "noopener noreferrer" : undefined}
                      target={route.target}
                    >
                      {route.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-gray-800" />
        <div className="flex w-full items-center justify-between py-4 text-sm">
          <p>&copy;{new Date().getFullYear()}. All rights reserved. Community Pro</p>
          <div className="flex items-center gap-x-3">
            <Link className="link before:bg-white" href="/terms">
              Terms
            </Link>
            <span className="size-1 rounded-full bg-gray-400" />
            <Link className="link before:bg-white" href="/privacy">
              Privacy
            </Link>
            <span className="size-1 rounded-full bg-gray-400" />
            <Link className="link before:bg-white" href="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
