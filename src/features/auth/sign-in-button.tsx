import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GithubMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

/**
 * "Continue with GitHub" button that starts the OAuth relay via a full-page navigation to
 * `/api/auth/login`. Styled in the brand palette (yellow surface, black text).
 *
 * @param props - Extra button props (e.g. `size`, `className`); `asChild` is fixed.
 * @returns The GitHub sign-in button.
 * @example
 * <SignInButton size="xl" />
 */
export const SignInButton = ({ className, size = "lg", ...props }: Omit<ComponentProps<typeof Button>, "asChild">) => (
  <Button asChild size={size} className={cn("gap-2", className)} {...props}>
    <a href="/api/auth/login">
      <GithubMark />
      Continue with GitHub
    </a>
  </Button>
);
