import { z } from "zod";

import { EXPERIENCE_LEVELS, MEMBER_ROLES } from "./types";

/** An optional URL field: accepts a valid URL, or an empty string normalized to `undefined`. */
const optionalUrl = z
  .union([z.literal(""), z.url({ message: "Enter a valid URL." })])
  .optional()
  .transform((value) => (value === "" || value === undefined ? undefined : value));

/**
 * Zod schema mirroring the backend's `members.invalid_profile` validation for
 * `PUT /members/me`. Used with `zodResolver` in `ProfileForm`.
 *
 * @example
 * const result = profileSchema.safeParse(formValues);
 * if (!result.success) console.error(result.error.issues);
 */
export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required.")
    .max(100, "Display name must be 100 characters or fewer."),
  title: z.string().refine((value) => (MEMBER_ROLES as readonly string[]).includes(value), {
    message: "Choose a role.",
  }),
  bio: z
    .string()
    .trim()
    .max(280, "Bio must be 280 characters or fewer.")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  portfolioUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  avatarUrl: optionalUrl,
  skills: z
    .array(z.string().trim().min(1, "Skills can't be empty.").max(40, "Skills must be 40 characters or fewer."))
    .max(15, "You can list up to 15 skills.")
    .refine((skills) => new Set(skills.map((skill) => skill.toLowerCase())).size === skills.length, {
      message: "Skills must be unique.",
    }),
  experience: z.enum(EXPERIENCE_LEVELS, { message: "Choose an experience level." }),
});

/** Form values inferred from `profileSchema`, post-transform. */
export type ProfileFormValues = z.infer<typeof profileSchema>;
