interface RouteConfig {
  name: string;
  href: string;
  disabled?: boolean;
}

interface SectionConfig {
  name: string;
  routes: RouteConfig[];
}

export const HEADER_ROUTES: RouteConfig[] = [
  { href: "/", name: "Discover" },
  { href: "/events", name: "Events", disabled: true },
  { href: "/top-contributors", name: "Top Contributors", disabled: true },
  { href: "/sponsors", name: "Sponsors", disabled: true },
  { href: "/learn", name: "Learn", disabled: true },
];

export const FOOTER_ROUTES: SectionConfig[] = [
  {
    name: "Community",
    routes: [
      { href: "/events", name: "Events", disabled: true },
      { href: "/top-contributors", name: "Top Contributors", disabled: true },
      { href: "/sponsors", name: "Sponsors", disabled: true },
      { href: "/learn", name: "Learn", disabled: true },
    ],
  },
  { name: "Resources", routes: [] },
  { name: "Support", routes: [] },
];
