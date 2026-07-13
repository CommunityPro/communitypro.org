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
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="fixed top-7 left-1/2 z-50! mx-auto flex w-full max-w-7xl -translate-x-1/2 items-center justify-between rounded-md border bg-white/50 px-3 py-2 backdrop-blur backdrop-filter dark:bg-black/50">
      <Link className="relative block aspect-square size-8" href="/">
        <Image alt="community-pro" className="object-cover" fill sizes="100%" src={image} />
      </Link>
      <div className="flex items-center gap-x-5">
        {HEADER_ROUTES.map((route) => (
          <Link
            className={cn(
              "relative text-sm",
              route.href === normalize(pathname)
                ? "border-main border-b-2 font-bold before:scale-x-100"
                : "link before:bg-foreground font-medium",
            )}
            href={route.href}
            key={route.href}
          >
            {route.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-x-5">
        <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} size="icon" variant="outline">
          <Moon className="size-4 dark:hidden" />
          <Sun className="hidden size-4 dark:block" />
        </Button>
        <Button asChild>
          <Link href="/join-community">Join</Link>
        </Button>
      </div>
    </header>
  );
};
