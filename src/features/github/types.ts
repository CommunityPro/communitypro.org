export type OrgStats = {
  members: number;
  publicRepos: number;
  stars: number;
  forks: number;
  followers: number;
  foundedYear: number;
};

export type OrgMember = {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
};

export type Contributor = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
};

export type FeaturedMember = Contributor & {
  bio: string | null;
  followers: number;
  location: string | null;
};

export type MemberHub = {
  label: string;
  country: string;
  lat: number;
  lng: number;
  members: number;
};

export type HomeData = {
  stats: OrgStats | null;
  wall: OrgMember[];
  contributors: Contributor[];
  featured: FeaturedMember | null;
  hubs: MemberHub[];
  practiceRepo: { forks: number; stars: number; url: string } | null;
};
