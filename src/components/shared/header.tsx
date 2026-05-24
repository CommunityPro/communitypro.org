"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { HEADER_ROUTES } from "@/config/route";
import { cn } from "@/lib/utils";

const image = "/assets/images/community-pro.png";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScrolled = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScrolled);
    return () => window.removeEventListener("scroll", handleScrolled);
  });

  return (
    <header className={cn("mx-auto flex max-w-7xl items-center py-4", scrolled ? "" : "")}>
      <div className="flex w-full items-center justify-between">
        <div className="relative aspect-square size-10">
          <Image alt="community-pro" className="object-cover" fill sizes="100%" src={image} />
        </div>
        <div className="flex items-center gap-x-5">
          {HEADER_ROUTES.map((route) => (
            <Link className="link before:bg-text-100 text-sm font-medium" href={route.href} key={route.href}>
              {route.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-x-5">
          <button
            className="grid size-8 place-items-center rounded border"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
