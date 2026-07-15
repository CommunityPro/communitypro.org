/** Experience levels a member profile can declare, ordered junior to senior. */
export const EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;

/** Union of valid `MemberProfile.experience` values. */
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/** Roles a member can pick for their profile; stored as `title` on the backend. */
export const MEMBER_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "QA Engineer",
  "Product Manager",
] as const;

/** Union of valid member role values. */
export type MemberRole = (typeof MEMBER_ROLES)[number];

/** A member's public profile, as returned by every `/members/*` endpoint. */
export type MemberProfile = {
  id: string;
  displayName: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  skills: string[];
  experience: ExperienceLevel;
  isFeatured: boolean;
  joinedAt: string;
};

/** Body accepted by `PUT /members/me` to create or update the caller's profile. */
export type UpdateProfileInput = {
  displayName: string;
  title: string;
  bio?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  skills: string[];
  experience: ExperienceLevel;
};

/** Signed payload used to upload an avatar directly to Cloudinary. */
export type AvatarSignPayload = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
};
