"use client";

import { usePostHog } from "@posthog/react";
import { useEffect } from "react";

/**
 * Fires the home page_view PostHog event once on mount. Exists so the page itself
 * can stay a server component.
 *
 * @returns Nothing renders.
 * @example
 * <PageviewTracker />
 */
export const PageviewTracker = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("page_view");
  }, [posthog]);

  return null;
};
