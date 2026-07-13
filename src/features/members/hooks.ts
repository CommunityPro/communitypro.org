import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { fetchMyProfile, fetchSpotlight, updateMyProfile } from "./api";
import type { MemberProfile, UpdateProfileInput } from "./types";
import { membersKeys } from "@/lib/query/keys";
import { isApiError } from "@/lib/api";

/**
 * Fetches the home page member spotlight roster.
 *
 * @returns A React Query result whose `data` is the spotlight list (undefined while loading).
 * @example
 * const { data: spotlight, isLoading } = useSpotlight();
 */
export const useSpotlight = () =>
  useQuery({
    queryKey: membersKeys.spotlight(),
    queryFn: fetchSpotlight,
  });

/**
 * Fetches the signed-in member's own profile.
 *
 * @returns A React Query result; a `members.not_found` `ApiRequestError` surfaces as
 *   `error` so callers can render a friendly "still being created" state.
 * @example
 * const { data: profile, error } = useMyProfile();
 */
export const useMyProfile = () =>
  useQuery({
    queryKey: membersKeys.me(),
    queryFn: fetchMyProfile,
    retry: (failureCount, error) => !(isApiError(error) && error.status < 500) && failureCount < 2,
  });

/**
 * Saves the signed-in member's profile: updates the `me` cache in place and invalidates
 * the spotlight list (a featured/newest profile change can affect it), with toast
 * feedback on success or failure.
 *
 * @returns A React Query mutation accepting `UpdateProfileInput`.
 * @example
 * const updateProfile = useUpdateProfile();
 * updateProfile.mutate(values);
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateMyProfile(input),
    onSuccess: (profile: MemberProfile) => {
      queryClient.setQueryData(membersKeys.me(), profile);
      queryClient.invalidateQueries({ queryKey: membersKeys.spotlight() });
      toast.success("Profile saved.");
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : "Couldn't save your profile — try again.");
    },
  });
};
