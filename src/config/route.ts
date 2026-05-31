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
      { href: "/contact", name: "Contact", disabled: true },
      { href: "/faq", name: "FAQ", disabled: true },
    ],
  },
  {
    name: "Resources",
    routes: [
      { href: "/blog", name: "Blog", disabled: true },
      { href: "/community", name: "Community", disabled: true },
      { href: "/e-library", name: "e-Library", disabled: true },
    ],
  },
  {
    name: "Social",
    routes: [
      { href: "https://github.com/communitypro", name: "GitHub", disabled: true },
      { href: "https://x.com/communitypro47", name: "Twitter", disabled: true },
      { href: "https://chat.whatsapp.com/BMFVTksMg269GdgsviJzLm", name: "WhatsApp", disabled: true },
      { href: "https://linkedin.com/", name: "LinkedIn", disabled: true },
      { href: "https://are.na", name: "Are.na", disabled: true },
    ],
  },
];
