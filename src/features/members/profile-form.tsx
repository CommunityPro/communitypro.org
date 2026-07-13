"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EXPERIENCE_LEVELS, type MemberProfile } from "./types";
import { useMyProfile, useUpdateProfile } from "./hooks";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "./profile-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api";
import { uploadAvatar } from "./api";

type ProfileFormInput = z.input<typeof profileSchema>;
type ProfileFormOutput = z.output<typeof profileSchema>;

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const toFormInput = (profile: MemberProfile): ProfileFormInput => ({
  displayName: profile.displayName,
  title: profile.title,
  bio: profile.bio ?? "",
  portfolioUrl: profile.portfolioUrl ?? "",
  githubUrl: profile.githubUrl ?? "",
  linkedinUrl: profile.linkedinUrl ?? "",
  avatarUrl: profile.avatarUrl ?? "",
  skills: profile.skills,
  experience: profile.experience,
});

const EMPTY_DEFAULTS: ProfileFormInput = {
  displayName: "",
  title: "",
  bio: "",
  portfolioUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  avatarUrl: "",
  skills: [],
  experience: "Junior",
};

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/**
 * Member self-service profile editor: react-hook-form + zod validation, skills entered
 * as chips, and a Cloudinary-backed avatar uploader. Handles the just-activated race
 * where `GET /members/me` briefly 404s with `members.not_found`.
 *
 * @returns The profile form, or a friendly loading/error state while data resolves.
 * @example
 * <ProfileForm />
 */
export const ProfileForm = () => {
  const { data: profile, isLoading, error, refetch, isRefetching } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const [skillDraft, setSkillDraft] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const form = useForm<ProfileFormInput, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: EMPTY_DEFAULTS,
    values: profile ? toFormInput(profile) : undefined,
  });

  const skills = form.watch("skills");
  const avatarUrl = form.watch("avatarUrl");
  const displayName = form.watch("displayName");

  const addSkill = (raw: string) => {
    const skill = raw.trim();
    if (!skill) return;
    if (skills.some((existing) => existing.toLowerCase() === skill.toLowerCase())) {
      setSkillDraft("");
      return;
    }
    form.setValue("skills", [...skills, skill], { shouldDirty: true, shouldValidate: true });
    setSkillDraft("");
  };

  const removeSkill = (skill: string) => {
    form.setValue(
      "skills",
      skills.filter((existing) => existing !== skill),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const handleSkillKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill(skillDraft);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Avatar must be 2MB or smaller.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const uploadedUrl = await uploadAvatar(file);
      form.setValue("avatarUrl", uploadedUrl, { shouldDirty: true, shouldValidate: true });
      toast.success("Avatar uploaded.");
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Avatar upload failed.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    updateProfile.mutate(values);
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted h-24 w-24 animate-pulse rounded-full" />
        <div className="bg-muted h-9 w-full animate-pulse rounded-md" />
        <div className="bg-muted h-9 w-full animate-pulse rounded-md" />
        <div className="bg-muted h-24 w-full animate-pulse rounded-md" />
      </div>
    );
  }

  if (error && isApiError(error) && error.code === "members.not_found") {
    return (
      <div className="border-border-default flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
        <p className="font-semibold">Your profile is still being created.</p>
        <p className="text-muted-foreground text-sm">
          This only takes a moment after activation. Refresh to try again.
        </p>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? "Checking…" : "Refresh"}
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-border-default flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
        <p className="font-semibold">Couldn&apos;t load your profile.</p>
        <p className="text-muted-foreground text-sm">{isApiError(error) ? error.message : "Try again shortly."}</p>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? "Checking…" : "Try again"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || "Avatar preview"} />}
          <AvatarFallback>{initialsOf(displayName || "?")}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <Button asChild variant="outline" size="sm" disabled={isUploadingAvatar}>
            <label className="cursor-pointer">
              {isUploadingAvatar ? "Uploading…" : "Change avatar"}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </Button>
          <p className="text-muted-foreground text-xs">PNG or JPG, up to 2MB.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display name
        </label>
        <Input id="displayName" {...form.register("displayName")} />
        {form.formState.errors.displayName && (
          <p className="text-destructive text-xs">{form.formState.errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input id="title" placeholder="Senior Backend Dev" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-destructive text-xs">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea id="bio" rows={3} maxLength={280} {...form.register("bio")} />
        {form.formState.errors.bio && <p className="text-destructive text-xs">{form.formState.errors.bio.message}</p>}
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium">Experience</span>
        <Controller
          control={form.control}
          name="experience"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="skills" className="text-sm font-medium">
          Skills
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" asChild>
              <button type="button" onClick={() => removeSkill(skill)} className="gap-1">
                {skill}
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          id="skills"
          value={skillDraft}
          onChange={(event) => setSkillDraft(event.target.value)}
          onKeyDown={handleSkillKeyDown}
          onBlur={() => addSkill(skillDraft)}
          placeholder="Type a skill and press Enter"
        />
        {form.formState.errors.skills && (
          <p className="text-destructive text-xs">
            {form.formState.errors.skills.message ?? form.formState.errors.skills.root?.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="portfolioUrl" className="text-sm font-medium">
          Portfolio URL
        </label>
        <Input id="portfolioUrl" placeholder="https://" {...form.register("portfolioUrl")} />
        {form.formState.errors.portfolioUrl && (
          <p className="text-destructive text-xs">{form.formState.errors.portfolioUrl.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="githubUrl" className="text-sm font-medium">
          GitHub URL
        </label>
        <Input id="githubUrl" placeholder="https://github.com/" {...form.register("githubUrl")} />
        {form.formState.errors.githubUrl && (
          <p className="text-destructive text-xs">{form.formState.errors.githubUrl.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="linkedinUrl" className="text-sm font-medium">
          LinkedIn URL
        </label>
        <Input id="linkedinUrl" placeholder="https://linkedin.com/in/" {...form.register("linkedinUrl")} />
        {form.formState.errors.linkedinUrl && (
          <p className="text-destructive text-xs">{form.formState.errors.linkedinUrl.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
};
