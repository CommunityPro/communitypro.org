"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { HEADER_ROUTES } from "@/config/route";
import { Button } from "../ui/button";
import { cn, normalize } from "@/lib";

const image = "/assets/images/community-pro.png";

export const Header = () => {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="fixed top-7 left-1/2 z-50! mx-auto flex w-full max-w-7xl -translate-x-1/2 items-center justify-between rounded-md border bg-white/50 px-3 py-2 backdrop-blur backdrop-filter dark:bg-black/50">
      <div className="relative aspect-square size-8">
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
          <Link href="/join-community">Join</Link>
        </Button>
      </div>
    </header>
  );
};
