import * as React from "react";

import { cn } from "@/lib/index";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-main aria-invalid:border-destructive dark:bg-input/30 dark:aria-invalid:border-destructive/50 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
