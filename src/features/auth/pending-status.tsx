"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "./store";

/**
 * Interactive footer of the `/welcome` pending screen: redirects visitors who don't
 * belong here (anonymous → join page, already-active → profile) and offers a
 * "Check my status" action that re-resolves `GET /me` after their practice PR merges.
 *
 * @returns The status-check button with contextual redirects wired in.
 * @example
 * <PendingStatusActions />
 */
export const PendingStatusActions = () => {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "anonymous" || user === null) {
      router.replace("/join-community");
      return;
    }
    if (user.status === "active") router.replace("/profile");
  }, [router, status, user]);

  const checkStatus = async () => {
    setChecking(true);
    try {
      await hydrate();
      const fresh = useAuthStore.getState().user;
      if (fresh?.status === "active") {
        toast.success("Your PR is merged — welcome aboard!");
        router.replace("/profile");
      } else {
        toast.info("Not merged yet. We'll activate you the moment it lands.");
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <Button size="lg" onClick={checkStatus} disabled={checking} className="gap-2">
      <RefreshCw className={checking ? "animate-spin" : undefined} />
      {checking ? "Checking…" : "Check my status"}
    </Button>
  );
};
