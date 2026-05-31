"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { HEADER_ROUTES } from "@/config/route";
import { Button } from "../ui/button";
import { cn, normalize } from "@/lib";

const image = "/assets/images/community-pro.png";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScrolled = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", handleScrolled);
    return () => window.removeEventListener("scroll", handleScrolled);
  });

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-30! flex w-full items-center py-4",
        scrolled ? "bg-white/50 backdrop-blur backdrop-filter dark:bg-black/50" : "static bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="relative aspect-square size-10">
          <Image alt="community-pro" className="object-cover" fill sizes="100%" src={image} />
        </div>
        <div className="flex items-center gap-x-5">
          {HEADER_ROUTES.map((route) => (
            <Link
              className={cn(
                "link text-sm font-medium",
                route.href === normalize(pathname) ? "underline underline-offset-4" : "before:bg-foreground",
              )}
              href={route.href}
              key={route.href}
            >
              {route.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-x-5">
          <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} size="icon" variant="outline">
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button asChild>
            <Link href="/join-community">Join Community</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
