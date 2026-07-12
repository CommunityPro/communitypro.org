import * as React from "react";

import { cn } from "@/lib/index";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive dark:bg-input/30 dark:aria-invalid:border-destructive/50 focus-visible:border-main h-9 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
