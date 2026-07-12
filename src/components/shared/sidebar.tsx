"use client";

import { useGlobalStore } from "@/store";
import { cn } from "@/lib";

export const Sidebar = () => {
  const { isCollapsed } = useGlobalStore();

  return (
    <aside className={cn("", isCollapsed ? "w-65" : "w-16")}>
      <div className=""></div>
      <div className=""></div>
    </aside>
  );
};
