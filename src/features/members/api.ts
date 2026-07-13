import type { AvatarSignPayload, MemberProfile, UpdateProfileInput } from "./types";
import { apiFetch, isApiError } from "@/lib/api";

/**
 * Fetches the spotlight roster for the home page: featured members first, then newest,
 * capped at 12 by the backend.
 *
 * @returns Up to 12 member profiles; empty array once no members exist yet.
 * @example
 * const spotlight = await fetchSpotlight();
 */
export const fetchSpotlight = async (): Promise<MemberProfile[]> => apiFetch<MemberProfile[]>("/members/spotlight");

/**
 * Fetches the signed-in member's own profile.
 *
 * @returns The caller's profile; throws `ApiRequestError` with code `members.not_found`
 *   when the profile hasn't been provisioned yet (rare race right after activation).
 * @example
 * const me = await fetchMyProfile();
 */
export const fetchMyProfile = async (): Promise<MemberProfile> => apiFetch<MemberProfile>("/members/me");

/**
 * Creates or updates the signed-in member's profile.
 *
 * @param input - The full editable profile payload.
 * @returns The updated profile as persisted by the backend.
 * @example
 * const updated = await updateMyProfile({
 *   displayName: "Ada Lovelace",
 *   title: "Senior Backend Dev",
 *   skills: ["TypeScript", "C#"],
 *   experience: "Senior",
 * });
 */
export const updateMyProfile = async (input: UpdateProfileInput): Promise<MemberProfile> =>
  apiFetch<MemberProfile>("/members/me", { method: "PUT", body: JSON.stringify(input) });

/**
 * Requests a signed Cloudinary upload payload for the caller's avatar.
 *
 * @returns Signing parameters to attach to a direct Cloudinary upload.
 * @example
 * const payload = await signAvatarUpload();
 */
export const signAvatarUpload = async (): Promise<AvatarSignPayload> =>
  apiFetch<AvatarSignPayload>("/members/me/avatar/sign", { method: "POST" });

type CloudinaryUploadResponse = { secure_url: string };

/**
 * Uploads an avatar image straight to Cloudinary using a freshly signed payload from the
 * backend, never proxying image bytes through the API.
 *
 * @param file - The image file selected by the member (validate type/size before calling).
 * @returns The Cloudinary `secure_url` to save onto the profile's `avatarUrl`.
 * @example
 * const avatarUrl = await uploadAvatar(file);
 * form.setValue("avatarUrl", avatarUrl);
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  let payload: AvatarSignPayload;
  try {
    payload = await signAvatarUpload();
  } catch (error) {
    if (isApiError(error) && error.code === "members.avatar_signing_unconfigured") {
      throw new Error("Avatar uploads aren't configured yet — try again later.");
    }
    throw error;
  }

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", payload.apiKey);
  body.set("timestamp", String(payload.timestamp));
  body.set("signature", payload.signature);
  body.set("folder", payload.folder);
  body.set("public_id", payload.publicId);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${payload.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) throw new Error("Avatar upload failed — try a different image.");

  const uploaded = (await response.json()) as CloudinaryUploadResponse;
  return uploaded.secure_url;
};
